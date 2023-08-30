import { produce } from 'immer'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { create } from 'zustand'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { getGraphProjectWithParsedMetadata, getProjectImageUrl } from '~/getters'
import { TimeUnit, timeUnitSecondsMultiplierMap } from '~/shared/utils/timeUnit'
import { getConfigForChain } from '~/shared/web3/config'
import { getTokenInfo } from '~/hooks/useTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
import { getMostRelevantTimeUnit } from '~/marketplace/utils/price'
import { isProjectOwnedBy } from '~/utils'
import getGraphClient from '~/getters/getGraphClient'
import { ProjectType, Project, QueriedGraphProject } from '~/shared/types'
import { toBN } from '~/utils/bn'
import {
    GetProjectQuery,
    GetProjectDocument,
    GetProjectQueryVariables,
} from '~/generated/gql/network'
import { ProjectMetadata } from '~/shared/consts'
import { getDataUnionAdminFee } from '~/getters/du'
import { useHasActiveProjectSubscription } from './purchases'
import { useWalletAccount } from './wallet'

interface ProjectDraft {
    abandoned: boolean
    errors: Record<string, string | undefined>
    persisting: boolean
    project: {
        hot: Project
        cold: Project
        graph: QueriedGraphProject | undefined
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

async function getSalePointsFromPaymentDetails<
    T extends Pick<QueriedGraphProject, 'paymentDetails'>,
>({ paymentDetails }: T): Promise<Project['salePoints']> {
    const result: Project['salePoints'] = {}

    for (let i = 0; i < paymentDetails.length; i++) {
        try {
            const { domainId, pricingTokenAddress, pricePerSecond, beneficiary } =
                paymentDetails[i]

            const { id: chainId, name: chainName } = getConfigForChain(Number(domainId))

            const { decimals } = (await getTokenInfo(pricingTokenAddress, chainId)) || {}

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

async function getTransientProject<
    T extends Pick<
        QueriedGraphProject,
        'id' | 'streams' | 'paymentDetails' | 'isDataUnion'
    > & {
        metadata: ProjectMetadata
    },
>({ id, metadata, streams, paymentDetails, isDataUnion }: T): Promise<Project> {
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

    const salePoints = await getSalePointsFromPaymentDetails({ paymentDetails })

    const result: Project = {
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

    if (!isDataUnion) {
        return result
    }

    const {
        beneficiary: dataUnionId = undefined,
        domainId = undefined,
    }: { beneficiary?: unknown; domainId?: unknown } =
        paymentDetails.find((pd) => pd.beneficiary.length > 0) || {}

    if (
        typeof domainId !== 'string' ||
        !domainId ||
        typeof dataUnionId !== 'string' ||
        !dataUnionId
    ) {
        return {
            ...result,
            type: ProjectType.DataUnion,
            adminFee: '0',
            existingDUAddress: undefined,
            dataUnionChainId: undefined,
        }
    }

    let adminFee: number | undefined

    const dataUnionChainId = Number(domainId)

    try {
        adminFee = await getDataUnionAdminFee(dataUnionId, dataUnionChainId)
    } catch (e) {
        console.warn('Failed to load Data Union admin fee', e)
    }

    return {
        ...result,
        type: ProjectType.DataUnion,
        adminFee: toBN(adminFee || 0)
            .multipliedBy(100)
            .toString(),
        existingDUAddress: dataUnionId,
        dataUnionChainId,
    }
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

                    const {
                        data: { project: graphProject },
                    } = await getGraphClient().query<
                        GetProjectQuery,
                        GetProjectQueryVariables
                    >({
                        query: GetProjectDocument,
                        variables: {
                            id: id.toLowerCase(),
                        },
                    })

                    if (!graphProject) {
                        throw new Error('Not found or invalid')
                    }

                    const graphProjectWithMetadata =
                        getGraphProjectWithParsedMetadata(graphProject)

                    const transientProject = await getTransientProject(
                        graphProjectWithMetadata,
                    )

                    setDraft(draftId, (draft) => {
                        draft.project.hot = transientProject

                        draft.project.cold = transientProject

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
        /**
         * This hook depends on project id just as much as it does on the current recycled draft it.
         * Using it like below satisfies `react-hooks/exhaustive-deps` eslint rule.
         */
        projectId

        return recycledDraftId || uniqueId('ProjectDraft-')
        /**
         * We give each new project id a new draft id (unless we recycle), thus we've gotta
         * disable react-hooks/exhaustive-deps for the next line (`projectId` may seem redundant).
         */
    }, [projectId, recycledDraftId])

    const { init, abandon } = useProjectEditorStore(({ init, abandon }) => ({
        init,
        abandon,
    }))

    useEffect(() => {
        init(draftId, projectId)
    }, [draftId, init, abandon, projectId])

    useEffect(() => () => void abandon(draftId), [draftId, abandon])

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

    return isProjectOwnedBy(graph.permissions, address) || hasActiveProjectSubscription
}

export function useIsCurrentProjectDraftClean() {
    return true
}

export function useIsNewProject() {
    return typeof useProject().id === 'undefined'
}
