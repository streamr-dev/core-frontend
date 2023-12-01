import React, { useCallback } from 'react'
import { toaster } from 'toasterhea'
import { useNavigate } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { randomHex } from 'web3-utils'
import {
    ParsedProject,
    ProjectParser,
    getEmptyParsedProject,
} from '~/parsers/ProjectParser'
import { createDraftStore, getEmptyDraft } from '~/utils/draft'
import { ProjectType } from '~/shared/types'
import getGraphClient from '~/getters/getGraphClient'
import {
    GetProjectDocument,
    GetProjectQuery,
    GetProjectQueryVariables,
} from '~/generated/gql/network'
import { Operation } from '~/shared/toasts/TransactionListToast'
import { toastedOperations } from '~/utils/toastedOperation'
import {
    createProject,
    deployDataUnionContract,
    getPublishableProjectProperties,
    updateProject,
} from '~/services/projects'
import { getDataUnion } from '~/getters/du'
import { getProjectRegistryChainId } from '~/getters'
import networkPreflight from '~/utils/networkPreflight'
import { useHasActiveProjectSubscription } from '~/shared/stores/purchases'
import { useWalletAccount } from '~/shared/stores/wallet'
import { isProjectOwnedBy } from '~/utils'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { ValidationError } from '~/errors'
import routes from '~/routes'
import { toBN } from '~/utils/bn'

const {
    DraftContext: ProjectDraftContext,
    useDraft: useProjectDraft,
    useEntity: useProject,
    useInitDraft: useInitProjectDraft,
    useIsDraftBusy: useIsProjectDraftBusy,
    useIsDraftClean: useIsProjectDraftClean,
    usePersistCallback,
    useSetDraftErrors: useSetProjectDraftErrors,
    useUpdateEntity: useUpdateProject,
} = createDraftStore<ParsedProject>({
    async persist({ entity: { cold, hot: project } }) {
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
                const { domainIds, paymentDetails, adminFee, streams, metadata } =
                    await getPublishableProjectProperties(project)

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

                    const dataUnion = await getDataUnion(dataUnionId, domainId)

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
    },

    async fetch(projectId) {
        const {
            data: { project: graphProject },
        } = await getGraphClient().query<GetProjectQuery, GetProjectQueryVariables>({
            query: GetProjectDocument,
            variables: {
                id: projectId.toLowerCase(),
            },
            fetchPolicy: 'network-only',
        })

        if (!graphProject) {
            throw new Error('Not found or invalid')
        }

        return ProjectParser.parseAsync(graphProject)
    },

    getEmptyDraft() {
        return getEmptyDraft(
            getEmptyParsedProject({
                type: ProjectType.OpenData,
            }),
        )
    },

    isEqual(cold, hot) {
        return (
            !requiresAdminFeeUpdate(hot, cold) &&
            isEqual({ ...hot, adminFee: '' }, { ...cold, adminFee: '' })
        )
    },
})

export {
    ProjectDraftContext,
    useInitProjectDraft,
    useIsProjectDraftBusy,
    useIsProjectDraftClean,
    useProject,
    useProjectDraft,
    useSetProjectDraftErrors,
    useUpdateProject,
}

export function preselectSalePoint(project: ParsedProject) {
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
        !toBN(hot.adminFee || '0').isEqualTo(toBN(cold.adminFee || '0'))
    )
}

/**
 * Checks if the current wallet can access project's streams right away.
 * @returns `undefined` if it's undetermined (= fetching). A `boolean` otherwise.
 */
export function useIsAccessibleByCurrentWallet() {
    const wallet = useWalletAccount()

    const draft = useProjectDraft()

    const fetching = !!draft?.fetching

    const project = draft?.entity.cold

    const hasActiveProjectSubscription = useHasActiveProjectSubscription(
        project?.id,
        wallet,
    )

    if (fetching) {
        return
    }

    if (project?.type === ProjectType.OpenData) {
        return true
    }

    if (!wallet) {
        return false
    }

    return (
        isProjectOwnedBy(project?.permissions || [], wallet) ||
        hasActiveProjectSubscription
    )
}

const persistErrorToast = toaster(Toast, Layer.Toast)

export function usePersistProjectCallback() {
    const persist = usePersistCallback()

    const navigate = useNavigate()

    return useCallback(() => {
        persist({
            onDone(mounted) {
                if (!mounted) {
                    return
                }

                navigate(routes.projects.index())
            },

            onError(e) {
                if (e instanceof ValidationError) {
                    const ve: ValidationError = e

                    void (async () => {
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
                    })()
                }

                console.warn('Failed to publish', e)
            },
        })
    }, [persist, navigate])
}
