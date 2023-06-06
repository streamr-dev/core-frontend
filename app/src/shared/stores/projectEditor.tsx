import { produce } from 'immer'
import { z } from 'zod'
import { createContext, useContext, useEffect, useMemo } from 'react'
import BN from 'bignumber.js'
import { create } from 'zustand'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { getGraphUrl, getProjectImageUrl } from '$app/src/getters'
import { post } from '$shared/utils/api'
import { TimeUnit, timeUnitSecondsMultiplierMap } from '$shared/utils/timeUnit'
import { getConfigForChain } from '$shared/web3/config'
import { getTokenInformation } from '$mp/utils/web3'
import { fromDecimals } from '$mp/utils/math'
import { getMostRelevantTimeUnit } from '$mp/utils/price'
import { isProjectOwnedBy } from '$mp/utils/product'
import { getAdminFee, getDataUnionChainIdByAddress } from '$mp/modules/dataUnion/services'
import { ProjectType, Project } from '$shared/types'
import { GraphProject } from '$shared/consts'
import { useHasActiveProjectSubscription } from './purchases'
import { useWalletAccount } from './wallet'

type GraphProject = z.infer<typeof GraphProject>

interface ProjectDraft {
    abandoned: boolean
    errors: Record<string, string | undefined>
    persisting: boolean
    project: {
        hot: Project
        cold: Project
        graph: GraphProject | undefined
        changed: boolean
        fetching: boolean
    }
}

interface ProjectEditorStore {
    idMap: Record<string, string>
    drafts: Record<string, ProjectDraft | undefined>
    init: (draftId: string, projectId: string | undefined) => void
    persist: (draftId: string) => Promise<void>
    setError: (draftId: string, key: string, message: string) => void
    teardown: (draftId: string, options?: { onlyAbandoned?: boolean }) => void
    abandon: (draftId: string) => void
}

const initialProject: Project = {
    id: undefined,
    name: '',
    description: '',
    imageUrl: undefined,
    imageIpfsCid: undefined,
    newImageToUpload: undefined,
    streams: [],
    type: ProjectType.OpenData,
    termsOfUse: {
        termsName: '',
        termsUrl: '',
    },
    contact: {
        url: '',
        email: '',
        twitter: '',
        telegram: '',
        reddit: '',
        linkedIn: '',
    },
    creator: '',
    salePoints: {},
}

const initialDraft: ProjectDraft = {
    abandoned: false,
    errors: {},
    persisting: false,
    project: {
        hot: initialProject,
        cold: initialProject,
        graph: undefined,
        changed: false,
        fetching: false,
    },
}

const GraphResponse = z.object({
    data: z.object({
        projects: z.array(
            GraphProject.extend({
                metadata: z.string(),
            }),
        ),
    }),
})

/**
 * Fetches a project from the Graph.
 * @param projectId Project id.
 * @returns A project stored in the Graph with parsed `metadata`.
 */
async function fetchGraphProject(projectId: string) {
    const result = await post({
        url: getGraphUrl(),
        data: {
            query: `
                query {
                    projects(
                        where: { id: "${projectId.toLowerCase()}" }
                    ) {
                        id
                        counter
                        domainIds
                        score
                        metadata
                        streams
                        minimumSubscriptionSeconds
                        createdAt
                        updatedAt
                        isDataUnion
                        paymentDetails {
                            domainId
                            beneficiary
                            pricingTokenAddress
                            pricePerSecond
                        }
                        subscriptions {
                            userAddress
                            endTimestamp
                        }
                        permissions {
                            userAddress
                            canBuy
                            canDelete
                            canEdit
                            canGrant
                        }
                        purchases {
                            subscriber
                            subscriptionSeconds
                            price
                            fee
                            purchasedAt
                        }
                    }
                }
            `,
        },
    })

    try {
        const [project = undefined] = GraphResponse.parse(result).data.projects

        if (!project) {
            return null
        }

        const metadata = GraphProject.shape.metadata.parse(JSON.parse(project.metadata))

        return {
            ...project,
            metadata,
        } as GraphProject
    } catch (e) {
        console.warn(e)
    }

    return null
}

async function getSalePointsFromPaymentDetails(
    paymentDetails: GraphProject['paymentDetails'],
): Promise<Project['salePoints']> {
    const result: Project['salePoints'] = {}

    for (let i = 0; i < paymentDetails.length; i++) {
        try {
            const { domainId, pricingTokenAddress, pricePerSecond, beneficiary } =
                paymentDetails[i]

            const { id: chainId, name: chainName } = getConfigForChain(Number(domainId))

            const { decimals } =
                (await getTokenInformation(pricingTokenAddress, chainId)) || {}

            if (!decimals) {
                throw new Error('Invalid decimals')
            }

            const pricePerSecondFromDecimals = fromDecimals(pricePerSecond, decimals)

            const timeUnit: TimeUnit = getMostRelevantTimeUnit(pricePerSecondFromDecimals)

            const multiplier = timeUnitSecondsMultiplierMap.get(timeUnit)

            if (!multiplier) {
                throw new Error('Invalid multiplier')
            }

            result[chainName] = {
                chainId,
                pricingTokenAddress: pricingTokenAddress.toLowerCase(),
                pricePerSecond,
                beneficiaryAddress: beneficiary.toLowerCase(),
                timeUnit,
                price: pricePerSecondFromDecimals.multipliedBy(multiplier).toString(),
            }
        } catch (e) {
            console.warn('Could not convert payment details to sale point', e)
        }
    }

    return result
}

async function getProjectFromGraphProject({
    id,
    metadata,
    streams,
    paymentDetails,
    isDataUnion,
}: GraphProject): Promise<Project> {
    const {
        name,
        description,
        creator,
        imageUrl,
        imageIpfsCid,
        termsOfUse = initialProject.termsOfUse,
        contactDetails: contact = initialProject.contact,
    } = metadata

    const [payment = { pricePerSecond: '0' }, secondPayment] = paymentDetails
    const isOpenData = payment.pricePerSecond === '0' && !secondPayment
    const salePoints = await getSalePointsFromPaymentDetails(paymentDetails)

    let result: Project = {
        id,
        type: isOpenData ? ProjectType.OpenData : ProjectType.PaidData,
        name,
        description,
        creator,
        imageUrl: getProjectImageUrl({ imageUrl, imageIpfsCid }),
        imageIpfsCid,
        newImageToUpload: undefined,
        streams,
        termsOfUse: {
            ...termsOfUse,
            termsName: termsOfUse.termsName || '',
            termsUrl: termsOfUse.termsUrl || '',
        },
        contact: {
            url: contact.url || '',
            email: contact.email || '',
            twitter: contact.twitter || '',
            telegram: contact.telegram || '',
            reddit: contact.reddit || '',
            linkedIn: contact.linkedIn || '',
        },
        salePoints,
    }

    if (isDataUnion) {
        const duAddress = paymentDetails.find(
            (pd) => pd.beneficiary.length > 0,
        )?.beneficiary
        let adminFee = '0'
        let chainId: number | undefined = undefined

        if (duAddress) {
            try {
                chainId = await getDataUnionChainIdByAddress(duAddress)
                adminFee = await getAdminFee(duAddress, chainId)
            } catch (e) {
                console.error('Could not load Data Union details', e)
            }
        }

        result = {
            ...result,
            type: ProjectType.DataUnion,
            adminFee: new BN(adminFee).multipliedBy(100).toString(),
            existingDUAddress: duAddress,
            dataUnionChainId: chainId,
        }
    }

    return result
}

const useProjectEditorStore = create<ProjectEditorStore>((set, get) => {
    function isPersisting(draftId: string) {
        return get().drafts[draftId]?.persisting === true
    }

    function setDraft(
        draftId: string,
        update: (draft: ProjectDraft) => void,
        { force = false }: { force?: boolean } = {},
    ) {
        set((draft) =>
            produce(draft, (state) => {
                if (!state.drafts[draftId] && !force) {
                    return
                }

                state.drafts[draftId] = produce(
                    state.drafts[draftId] || initialDraft,
                    update,
                )
            }),
        )
    }

    function setProject(draftId: string, update: (project: Project) => void) {
        setDraft(draftId, (draft) => {
            update(draft.project.hot)

            draft.project.changed = !isEqual(draft.project.hot, draft.project.cold)
        })
    }

    return {
        idMap: {},

        drafts: {},

        init(draftId, projectId) {
            const recycled = !!get().drafts[draftId]

            setDraft(
                draftId,
                (draft) => {
                    draft.project.hot.id = projectId

                    draft.project.cold.id = draft.project.hot.id

                    draft.abandoned = false
                },
                {
                    force: true,
                },
            )

            if (!projectId || recycled) {
                return
            }

            async function fetch(id: string) {
                try {
                    setDraft(draftId, (draft) => {
                        draft.project.fetching = true
                    })

                    const graphProject = await fetchGraphProject(id)

                    if (!graphProject) {
                        throw new Error('Not found or invalid')
                    }

                    const project = await getProjectFromGraphProject(graphProject)

                    setDraft(draftId, (draft) => {
                        draft.project.hot = project

                        draft.project.cold = project

                        draft.project.graph = graphProject

                        draft.project.changed = false
                    })
                } catch (e) {
                    console.warn('Failed to load a project', e)
                } finally {
                    setDraft(draftId, (draft) => {
                        draft.project.fetching = false
                    })
                }
            }

            fetch(projectId)
        },

        async persist(draftId) {
            if (isPersisting(draftId)) {
                return
            }

            try {
                setDraft(draftId, (draft) => {
                    draft.persisting = true
                })

                set((store) =>
                    produce(store, (copy) => {
                        const { id } = copy.drafts[draftId]?.project.cold || {}

                        if (id) {
                            copy.idMap[id] = draftId
                        }
                    }),
                )

                // @TODO implement persisting
            } finally {
                setDraft(draftId, (draft) => {
                    draft.persisting = false
                })

                get().teardown(draftId, { onlyAbandoned: true })
            }
        },

        setError(draftId, key, message) {
            setDraft(draftId, (state) => {
                if (!message) {
                    return void delete state.errors[key]
                }

                state.errors[key] = message
            })
        },

        abandon(draftId) {
            set((store) =>
                produce(store, ({ drafts }) => {
                    const draft = drafts[draftId]

                    if (!draft) {
                        return
                    }

                    draft.abandoned = true
                }),
            )

            if (!isPersisting(draftId)) {
                get().teardown(draftId)
            }
        },

        teardown(draftId, { onlyAbandoned = false } = {}) {
            set((store) =>
                produce(store, ({ idMap, drafts }) => {
                    const draft = drafts[draftId]

                    if (!draft) {
                        return
                    }

                    const { id } = draft.project.cold

                    if (!onlyAbandoned || draft.abandoned) {
                        if (id) {
                            delete idMap[id]
                        }

                        delete drafts[draftId]
                    }
                }),
            )
        },
    }
})

export const ProjectDraftContext = createContext<string | undefined>(undefined)

export function useInitProject(projectId: string | undefined) {
    const recycledDraftId = useProjectEditorStore(({ idMap }) =>
        projectId ? idMap[projectId] : undefined,
    )

    const draftId = useMemo(() => {
        return recycledDraftId || uniqueId('ProjectDraft-')
        /**
         * We give each new project id a new draft id (unless we recycle), thus we've gotta
         * disable react-hooks/exhaustive-deps for the next line (`projectId` may seem redundant).
         */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, recycledDraftId])

    const { init, abandon } = useProjectEditorStore(({ init, abandon }) => ({
        init,
        abandon,
    }))

    useEffect(() => {
        init(draftId, projectId)

        return () => void abandon(draftId)
    }, [draftId, init, abandon, projectId])

    return draftId
}

function useDraftId() {
    return useContext(ProjectDraftContext)
}

function useDraft() {
    const draftId = useDraftId()

    return useProjectEditorStore(({ drafts }) => (draftId ? drafts[draftId] : undefined))
}

export function useProject({ hot = false } = {}) {
    const draft = useDraft()

    return (hot ? draft?.project.hot : draft?.project.cold) || initialProject
}

export function useIsProjectFetching() {
    const draft = useDraft()

    return !draft || draft.project.fetching
}

export function useIsProjectBusy() {
    const draft = useDraft()

    return !draft || draft.persisting || draft.project.fetching
}

export function useDoesUserHaveAccess() {
    const {
        project: { cold, graph },
    } = useDraft() || initialDraft

    const address = useWalletAccount()

    const hasActiveProjectSubscription = useHasActiveProjectSubscription(cold.id, address)

    if (!graph) {
        return false
    }

    if (cold.type === ProjectType.OpenData) {
        return true
    }

    if (!address) {
        return false
    }

    return isProjectOwnedBy(graph, address) || hasActiveProjectSubscription
}

export function useIsCurrentProjectDraftClean() {
    return true
}

export function useIsNewProject() {
    return typeof useProject().id === 'undefined'
}
