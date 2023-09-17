import { produce } from 'immer'
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { create } from 'zustand'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { getGraphProjectWithParsedMetadata, getProjectImageUrl } from '~/getters'
import {
    TimeUnit,
    timeUnitSecondsMultiplierMap,
    timeUnits,
} from '~/shared/utils/timeUnit'
import { getConfigForChain, getConfigForChainByName } from '~/shared/web3/config'
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
import getCoreConfig from '~/getters/getCoreConfig'
import { SalePoint } from '~/shared/types'
import { getDataAddress } from '~/marketplace/utils/web3'
import { ValidationError } from '~/marketplace/containers/ProjectEditing/ProjectController'
import isCodedError from '~/utils/isCodedError'
import { RejectionReason } from '~/modals/BaseModal'
import { Layer } from '~/utils/Layer'
import { PublishableProjectPayload } from '~/types/projects'
import Toast, { ToastType } from '../toasts/Toast'
import { useWalletAccount } from './wallet'
import { useHasActiveProjectSubscription } from './purchases'
import { createProject2 } from '~/services/projects'

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
    init: (
        draftId: string,
        projectId: string | undefined,
        projectType: string | null,
    ) => void
    persist: (draftId: string) => Promise<void>
    setErrors: (draftId: string, update: (errors: ProjectDraft['errors']) => void) => void
    teardown: (draftId: string, options?: { onlyAbandoned?: boolean }) => void
    abandon: (draftId: string) => void
    update: (draftId: string, upadte: (project: Project) => void) => void
}

export function getEmptySalePoint(chainId: number): SalePoint {
    return {
        beneficiaryAddress: '',
        chainId,
        enabled: false,
        price: '',
        pricingTokenAddress: getDataAddress(chainId).toLowerCase(),
        readOnly: false,
        timeUnit: timeUnits.day,
    }
}

function getEmptyTermsOfUse() {
    return {
        termsName: '',
        termsUrl: '',
        commercialUse: false,
        redistribution: false,
        reselling: false,
        storage: false,
    }
}

function getEmptyContact() {
    return {
        url: '',
        email: '',
        twitter: '',
        telegram: '',
        reddit: '',
        linkedIn: '',
    }
}

function getEmptyProject(): Project {
    const chains = getCoreConfig().marketplaceChains.map(getConfigForChainByName)

    const salePoints: Record<string, SalePoint | undefined> = {}

    chains.map(({ id: chainId, name: chainName }) => {
        salePoints[chainName] = getEmptySalePoint(chainId)
    })

    return {
        id: undefined,
        name: '',
        description: '',
        imageUrl: undefined,
        imageIpfsCid: undefined,
        newImageToUpload: undefined,
        streams: [],
        type: ProjectType.OpenData,
        termsOfUse: getEmptyTermsOfUse(),
        contact: getEmptyContact(),
        creator: '',
        salePoints,
    }
}

function getEmptyDraft(): ProjectDraft {
    const emptyProject = getEmptyProject()

    return {
        abandoned: false,
        errors: {},
        persisting: false,
        project: {
            hot: emptyProject,
            cold: emptyProject,
            graph: undefined,
            changed: false,
            fetching: false,
        },
    }
}

async function getSalePointsFromPaymentDetails<
    T extends Pick<QueriedGraphProject, 'paymentDetails'>,
>({ paymentDetails }: T): Promise<Project['salePoints']> {
    const result = getEmptyProject().salePoints

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
                beneficiaryAddress: beneficiary.toLowerCase(),
                chainId,
                enabled: true,
                price: pricePerSecondFromDecimals.multipliedBy(multiplier).toString(),
                pricingTokenAddress: pricingTokenAddress.toLowerCase(),
                readOnly: true,
                timeUnit,
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
        termsOfUse = getEmptyTermsOfUse(),
        contactDetails: contact = getEmptyContact(),
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
        streams: streams.sort(),
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
            adminFee: '',
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
        adminFee:
            typeof adminFee === 'undefined'
                ? ''
                : toBN(adminFee).multipliedBy(100).toString(),
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
                    state.drafts[draftId] || getEmptyDraft(),
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

        init(draftId, projectId, projectType) {
            const recycled = !!get().drafts[draftId]

            setDraft(
                draftId,
                (draft) => {
                    draft.project.hot.id = projectId

                    draft.project.cold.id = projectId

                    draft.abandoned = false

                    if (projectId) {
                        return
                    }

                    let type: ProjectType | undefined

                    switch (projectType) {
                        case ProjectType.DataUnion:
                        case ProjectType.PaidData:
                            type = projectType
                            break
                        case ProjectType.OpenData:
                        default:
                            type = ProjectType.OpenData
                    }

                    draft.project.hot.type = type

                    draft.project.cold.type = type
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

                const draft = get().drafts[draftId]

                if (!draft) {
                    throw new Error(`No such draft: ${draftId}`)
                }

                try {
                    const { hot: project } = draft.project

                    if (project.id) {
                        throw new Error('Updating not implemented')
                    }

                    await createProject2(project)
                } catch (e) {
                    if (e instanceof z.ZodError) {
                        const errors: ProjectDraft['errors'] = {}

                        e.issues.forEach(({ path, message }) => {
                            errors[path.join('.')] = message
                        })

                        setDraft(draftId, (copy) => {
                            copy.errors = errors
                        })

                        /**
                         * @TODO: ValidationError seems to be a redundant abstraction we can get rid
                         * of and use ZodError directly.
                         */
                        throw new ValidationError(e.issues.map(({ message }) => message))
                    }

                    console.warn('Failed to persist a project draft', e)
                }
            } finally {
                setDraft(draftId, (draft) => {
                    draft.persisting = false
                })

                get().teardown(draftId, { onlyAbandoned: true })
            }
        },

        setErrors(draftId, update) {
            setDraft(draftId, (state) => void update(state.errors))
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

        update: setProject,
    }
})

export const ProjectDraftContext = createContext<string | undefined>(undefined)

export function useInitProject(
    projectId: string | undefined,
    projectType: string | null,
) {
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
    }, [projectId, recycledDraftId])

    const { init, abandon } = useProjectEditorStore()

    useEffect(() => {
        init(draftId, projectId, projectType)
    }, [draftId, init, abandon, projectId, projectType])

    useEffect(() => () => void abandon(draftId), [draftId, abandon])

    return draftId
}

function useDraftId() {
    return useContext(ProjectDraftContext)
}

export function useDraft() {
    const draftId = useDraftId()

    return useProjectEditorStore(({ drafts }) => (draftId ? drafts[draftId] : undefined))
}

export function useProject({ hot = false } = {}) {
    const draft = useDraft()

    return (hot ? draft?.project.hot : draft?.project.cold) || getEmptyProject()
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
    } = useDraft() || getEmptyDraft()

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
    return !useDraft()?.project.changed
}

export function useUpdateProject() {
    const draftId = useDraftId()

    const { update } = useProjectEditorStore()

    return useCallback(
        (updater: (project: Project) => void) => {
            if (!draftId) {
                return
            }

            return update(draftId, updater)
        },
        [draftId, update],
    )
}

const persistErrorToast = toaster(Toast, Layer.Toast)

export function usePersistCurrentProjectDraft() {
    const { persist } = useProjectEditorStore()

    const draftId = useDraftId()

    const busy = useIsProjectBusy()

    const clean = useIsCurrentProjectDraftClean()

    return useCallback(() => {
        if (!draftId || busy || clean) {
            return
        }

        setTimeout(async () => {
            try {
                await persist(draftId)
            } catch (e) {
                if (e instanceof ValidationError) {
                    const ve: ValidationError = e

                    return void setTimeout(async () => {
                        try {
                            await persistErrorToast.pop({
                                type: ToastType.Warning,
                                title: 'Failed to publish',
                                desc: (
                                    <ul>
                                        {ve.messages.map((message, index) => (
                                            <li key={index}>{message}</li>
                                        ))}
                                    </ul>
                                ),
                            })
                        } catch (e) {
                            // Ignore.
                        }
                    })
                }

                if (isCodedError(e) && e.code === 4001) {
                    return
                }

                if (
                    e === RejectionReason.CancelButton ||
                    e === RejectionReason.EscapeKey
                ) {
                    return
                }

                console.warn('Failed to publish', e)
            }
        })
    }, [draftId, persist, busy, clean])
}

export function useSetProjectErrors() {
    const draftId = useDraftId()

    const { setErrors } = useProjectEditorStore()

    return useCallback(
        (update: (errors: Record<string, string | undefined>) => void) => {
            if (!draftId) {
                return
            }

            return setErrors(draftId, update)
        },
        [draftId, setErrors],
    )
}
