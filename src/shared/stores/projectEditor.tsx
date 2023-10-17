import { produce } from 'immer'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react'
import { create } from 'zustand'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { randomHex } from 'web3-utils'
import { getProjectRegistryChainId } from '~/getters'
import { isProjectOwnedBy } from '~/utils'
import getGraphClient from '~/getters/getGraphClient'
import { ProjectType, QueriedGraphProject } from '~/shared/types'
import {
    GetProjectQuery,
    GetProjectDocument,
    GetProjectQueryVariables,
} from '~/generated/gql/network'
import { getDataUnion } from '~/getters/du'
import { ValidationError } from '~/errors'
import isCodedError from '~/utils/isCodedError'
import { RejectionReason } from '~/modals/BaseModal'
import { Layer } from '~/utils/Layer'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import useIsMounted from '~/shared/hooks/useIsMounted'
import {
    createProject,
    deployDataUnionContract,
    getPublishableProjectProperties,
    updateProject,
} from '~/services/projects'
import { toastedOperations } from '~/utils/toastedOperation'
import networkPreflight from '~/utils/networkPreflight'
import routes from '~/routes'
import {
    ParsedProject,
    ProjectParser,
    getEmptyParsedProject,
} from '~/parsers/ProjectParser'
import { Operation } from '../toasts/TransactionListToast'
import { useWalletAccount } from './wallet'
import { useHasActiveProjectSubscription } from './purchases'

interface ProjectDraft {
    abandoned: boolean
    errors: Record<string, string | undefined>
    persisting: boolean
    project: {
        hot: ParsedProject
        cold: ParsedProject
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
    update: (draftId: string, update: (project: ParsedProject) => void) => void
}

function getEmptyDraft(): ProjectDraft {
    const emptyProject = getEmptyParsedProject()

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

function preselectSalePoint(project: ParsedProject) {
    if (project.type === ProjectType.OpenData) {
        return
    }

    const values = Object.values(project.salePoints)

    if (values.some((salePoint) => salePoint?.enabled)) {
        /**
         * Project has at least one sale point selected already. We have to skip.
         */
        return
    }

    const [salePoint] = values

    if (!salePoint) {
        /**
         * Nothing to enable, eh?
         */
        return
    }

    salePoint.enabled = true
}

function requiresDataUnionDeployment(project: ParsedProject) {
    return (
        project.type === ProjectType.DataUnion &&
        !Object.values(project.salePoints).find((salePoint) => salePoint?.enabled)
            ?.beneficiaryAddress
    )
}

function requiresAdminFeeUpdate(hot: ParsedProject, cold: ParsedProject) {
    return (
        hot.type === ProjectType.DataUnion &&
        (hot.adminFee || '0').trim() !== (cold.adminFee || '0').trim()
    )
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

    function setProject(draftId: string, update: (project: ParsedProject) => void) {
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
                    const { hot, cold } = draft.project

                    hot.id = projectId

                    cold.id = projectId

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

                    hot.type = type

                    preselectSalePoint(hot)

                    cold.type = type

                    preselectSalePoint(cold)
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

                    const transientProject = await ProjectParser.parseAsync(graphProject)

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
                    const { hot: project, cold } = draft.project

                    const operations: Operation[] = []

                    if (project.id) {
                        const projectId = project.id

                        const shouldUpdateAdminFee = requiresAdminFeeUpdate(project, cold)

                        const shouldUpdateMatadata = !isEqual(
                            { ...project, adminFee: '' },
                            { ...cold, adminFee: '' },
                        )

                        if (shouldUpdateAdminFee) {
                            operations.push({
                                id: uniqueId('operation-'),
                                label: 'Update admin fee',
                            })
                        }

                        if (shouldUpdateMatadata) {
                            operations.push({
                                id: uniqueId('operation-'),
                                label: 'Update project',
                            })
                        }

                        return void (await toastedOperations(operations, async (next) => {
                            const {
                                domainIds,
                                paymentDetails,
                                adminFee,
                                streams,
                                metadata,
                            } = await getPublishableProjectProperties(project)

                            if (shouldUpdateAdminFee) {
                                const [domainId] = domainIds

                                const [paymentDetail] = paymentDetails

                                if (!domainId) {
                                    throw new Error('No chain id')
                                }

                                if (typeof adminFee === 'undefined') {
                                    throw new Error('No admin fee')
                                }

                                if (!paymentDetail) {
                                    throw new Error('No payment details')
                                }

                                const { beneficiary: dataUnionId } = paymentDetail

                                if (!dataUnionId) {
                                    /**
                                     * Something broke above. We can update a Data Union only when
                                     * we know its deployment address.
                                     */
                                    throw new Error('No Data Union id')
                                }

                                const dataUnion = await getDataUnion(
                                    dataUnionId,
                                    domainId,
                                )

                                await dataUnion.setAdminFee(adminFee)

                                next()
                            }

                            if (shouldUpdateMatadata) {
                                await updateProject(projectId, {
                                    domainIds,
                                    metadata,
                                    paymentDetails,
                                    streams,
                                })
                            }
                        }))
                    }

                    const shouldDeployDataUnion = requiresDataUnionDeployment(project)

                    if (shouldDeployDataUnion) {
                        operations.push({
                            id: uniqueId('operation-'),
                            label: 'Deploy Data Union contract',
                        })
                    }

                    operations.push({
                        id: uniqueId('operation-'),
                        label: 'Create project',
                    })

                    await toastedOperations(operations, async (next) => {
                        const projectId = randomHex(32)

                        const { domainIds, paymentDetails, adminFee, streams, metadata } =
                            await getPublishableProjectProperties(project)

                        if (shouldDeployDataUnion) {
                            const [domainId] = domainIds

                            const [paymentDetail] = paymentDetails

                            if (!domainId) {
                                throw new Error('No chain id')
                            }

                            if (typeof adminFee === 'undefined') {
                                throw new Error('No admin fee')
                            }

                            if (!paymentDetail) {
                                throw new Error('No payment details')
                            }

                            if (paymentDetail.beneficiary) {
                                /**
                                 * Something broke above. See `requiresDataUnionDeployment` for details.
                                 * We only deploy a new Data Union if the `beneficiary` is empty.
                                 */
                                throw new Error('Unexpected beneficiary')
                            }

                            const chainId = getProjectRegistryChainId()

                            await networkPreflight(chainId)

                            const dataUnionId = await deployDataUnionContract(
                                projectId,
                                adminFee,
                                domainId,
                            )

                            /**
                             * We assing the newly deployed Data Union to the project
                             * we're currently persisting.
                             */
                            paymentDetail.beneficiary = dataUnionId

                            next()
                        }

                        await createProject(projectId, {
                            domainIds,
                            isPublicPurchasable: project.type !== ProjectType.OpenData,
                            metadata,
                            paymentDetails,
                            streams,
                        })
                    })
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

                    throw e
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

    return (hot ? draft?.project.hot : draft?.project.cold) || getEmptyParsedProject()
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
        (updater: (project: ParsedProject) => void) => {
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

    const navigate = useNavigate()

    const isMounted = useIsMounted()

    const onDoneRef = useRef(() => {
        if (!isMounted()) {
            /**
             * There's no way of getting to another project's edit page without unmountning
             * the current one thus using `isMounted` is safe here.
             */
            return
        }

        navigate(routes.projects.index())
    })

    return useCallback(() => {
        if (!draftId || busy || clean) {
            return
        }

        setTimeout(async () => {
            try {
                await persist(draftId)

                onDoneRef.current()
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
