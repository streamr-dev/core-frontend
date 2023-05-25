import React, {
    createContext,
    FunctionComponent,
    ReactNode,
    useCallback,
    useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import BN from 'bignumber.js'
import { z } from 'zod'
import { randomHex } from 'web3-utils'
import { Toaster, toaster } from 'toasterhea'
import uniqueId from 'lodash/uniqueId'
import { useProjectState } from '$mp/contexts/ProjectStateContext'
import { Layer } from '$utils/Layer'
import {
    SeverityLevel,
    useValidationContext,
} from '$mp/containers/ProductController/ValidationContextProvider'
import { ProjectType } from '$shared/types'
import { postImage } from '$app/src/services/images'
import {
    createProject,
    deleteProject as deleteProjectService,
    deployDataUnionContract,
    PaymentDetails,
    SmartContractProject,
    SmartContractProjectCreate,
    SmartContractProjectMetadata,
    updateProject,
} from '$app/src/services/projects'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChain } from '$shared/web3/config'
import { getDataAddress } from '$mp/utils/web3'
import TransactionListToast, {
    Operation,
    notify,
} from '$shared/toasts/TransactionListToast'
import address0 from '$utils/address0'
import routes from '$routes'
import { useEditableProjectActions } from '../ProductController/useEditableProjectActions'

export class ValidationError extends Error {
    name = 'ValidationError'

    constructor(readonly messages: string[]) {
        super(messages.join(', '))

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError)
        }

        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}

async function toastedProjectOperation(label: string, fn?: () => Promise<void>) {
    let toast: Toaster<typeof TransactionListToast> | undefined = toaster(
        TransactionListToast,
        Layer.Toast,
    )

    const operation: Operation = {
        id: uniqueId('operation-'),
        label: label,
        state: 'ongoing',
    }

    const operations = [operation]

    try {
        notify(toast, operations)

        await fn?.()

        operation.state = 'complete'

        notify(toast, operations)
    } catch (e) {
        operations.forEach((op) => {
            if (op.state === 'ongoing') {
                op.state = 'error'
            }
        })

        notify(toast, operations)

        throw e
    } finally {
        setTimeout(() => {
            toast?.discard()

            toast = undefined
        }, 3000)
    }
}

export type ProjectController = {
    create: () => Promise<void>
    update: () => Promise<void>
    deleteProject: () => Promise<void>
    publishInProgress: boolean
}

export const useProjectController = (): ProjectController => {
    const { state: project } = useProjectState()
    const { validate } = useValidationContext()
    const { updateExistingDUAddress } = useEditableProjectActions()
    const [publishInProgress, setPublishInProgress] = useState<boolean>(false)
    const { projectRegistry } = getCoreConfig()
    const registryChain = getConfigForChain(projectRegistry.chainId)
    const history = useHistory()

    const { id: projectId, type: projectType } = project || {}

    const checkValidationErrors = useCallback(() => {
        if (!project) {
            throw new Error('No project')
        }

        const validationResult = validate(project)

        const errors = Object.keys(validationResult)
            .filter(
                (key) =>
                    validationResult[key] &&
                    validationResult[key].level === SeverityLevel.ERROR,
            )
            .map((key) => validationResult[key].message)

        if (errors.length) {
            throw new ValidationError(errors)
        }
    }, [project, validate])

    const getProjectMetadata = useCallback<
        () => Promise<SmartContractProjectMetadata>
    >(async () => {
        const metadata: SmartContractProjectMetadata = {
            name: project.name,
            description: project.description,
            imageIpfsCid: project.imageIpfsCid,
            creator: project.creator,
            contactDetails: {
                email: project?.contact?.email,
                url: project?.contact?.url,
                twitter: project?.contact?.twitter,
                telegram: project?.contact?.telegram,
                reddit: project?.contact?.reddit,
                linkedIn: project?.contact?.linkedIn,
            },
            termsOfUse: { ...project.termsOfUse },
            isDataUnion: project.type === ProjectType.DataUnion,
        }
        if (project.newImageToUpload) {
            metadata.imageIpfsCid = await postImage(project.newImageToUpload)
        }
        return metadata
    }, [project])

    const getProjectPaymentDetails = useCallback<() => PaymentDetails[]>(() => {
        if (projectType === ProjectType.PaidData) {
            return Object.values(project.salePoints ?? []).map((salePoint) => {
                return {
                    chainId: salePoint.chainId,
                    beneficiaryAddress: salePoint.beneficiaryAddress,
                    pricePerSecond: salePoint.pricePerSecond,
                    pricingTokenAddress: salePoint.pricingTokenAddress,
                }
            })
        } else if (projectType === ProjectType.DataUnion) {
            return Object.values(project.salePoints ?? []).map((salePoint) => {
                return {
                    chainId: salePoint.chainId,
                    beneficiaryAddress: project.existingDUAddress,
                    pricePerSecond: salePoint.pricePerSecond,
                    pricingTokenAddress: salePoint.pricingTokenAddress,
                }
            })
        } else if (projectType === ProjectType.OpenData) {
            return [
                {
                    chainId: registryChain.id,
                    beneficiaryAddress: address0,
                    pricePerSecond: new BN(0),
                    pricingTokenAddress: getDataAddress(registryChain.id),
                },
            ]
        } else {
            throw new Error('Unsupported project type', projectType)
        }
    }, [project.existingDUAddress, project.salePoints, projectType, registryChain.id])

    const getSmartContractProject = useCallback(
        async (id?: string): Promise<SmartContractProject> => {
            const metadata: SmartContractProjectMetadata = await getProjectMetadata()
            return {
                metadata: JSON.stringify(metadata),
                chainId: registryChain.id,
                id: id || randomHex(32),
                minimumSubscriptionInSeconds: 0,
                streams: [...project.streams],
                paymentDetails: getProjectPaymentDetails(),
            }
        },
        [getProjectMetadata, getProjectPaymentDetails, registryChain.id, project.streams],
    )

    const createNewProject = useCallback<() => Promise<void>>(async () => {
        if (!projectType) {
            throw new Error('Invalid project')
        }

        setPublishInProgress(true)

        try {
            const projectContractData: SmartContractProjectCreate = {
                ...(await getSmartContractProject()),
                isPublicPurchasable: projectType !== ProjectType.OpenData,
            }

            await toastedProjectOperation('Create project', () =>
                createProject(projectContractData),
            )

            /**
             * @FIXME Prevent navigating to the project listing page if… the user
             * has already moved on.
             */
            history.push(routes.projects.index())
        } finally {
            setPublishInProgress(false)
        }
    }, [getSmartContractProject, projectType, history])

    const createNewDataUnion = useCallback<() => Promise<void>>(async () => {
        if (!projectType) {
            throw new Error('Invalid project')
        }

        setPublishInProgress(true)

        try {
            const projectContractData: SmartContractProjectCreate = {
                ...(await getSmartContractProject()),
                isPublicPurchasable: true,
            }

            let toast: Toaster<typeof TransactionListToast> | undefined = toaster(
                TransactionListToast,
                Layer.Toast,
            )

            const deployOperation: Operation = {
                id: 'deployDuContract',
                label: 'Deploy Data Union contract',
                state: 'ongoing',
            }
            const createOperation: Operation = {
                id: 'createProject',
                label: 'Create project',
                state: undefined,
            }

            const operations: Operation[] = [createOperation]

            // 1. Deploy data union contract
            if (project.isDeployingNewDU) {
                operations.unshift(deployOperation)

                try {
                    notify(toast, operations)

                    const { adminFee, dataUnionChainId } = project
                    if (adminFee == null || dataUnionChainId == null) {
                        throw new Error('Invalid project properties')
                    }
                    const percentValueAdminFee = new BN(adminFee).dividedBy(100).toString()

                    const duAddress = await deployDataUnionContract(projectContractData.id, percentValueAdminFee, dataUnionChainId)

                    // Update beneficiary address to match deployed contract
                    updateExistingDUAddress(duAddress)
                    projectContractData.paymentDetails = projectContractData.paymentDetails.map((pd) => ({
                        ...pd,
                        beneficiaryAddress: duAddress,
                    }))

                    deployOperation.state = 'complete'

                    notify(toast, operations)
                } catch (e) {
                    if (deployOperation.state === 'ongoing') {
                        deployOperation.state = 'error'
                    }

                    notify(toast, operations)

                    setTimeout(() => {
                        toast?.discard()

                        toast = undefined
                    }, 3000)

                    throw e
                }
            }

            // 2. Create project
            try {
                createOperation.state = 'ongoing'

                notify(toast, operations)

                await createProject(projectContractData)
                createOperation.state = 'complete'

                notify(toast, operations)
            } catch (e) {
                if (createOperation.state === 'ongoing') {
                    createOperation.state = 'error'
                }

                notify(toast, operations)

                throw e
            } finally {
                setTimeout(() => {
                    toast?.discard()

                    toast = undefined
                }, 3000)
            }

            /**
             * @FIXME Prevent navigating to the project listing page if… the user
             * has already moved on.
             */
            history.push(routes.projects.index())
        } finally {
            setPublishInProgress(false)
        }
    }, [projectType, getSmartContractProject, project, history, updateExistingDUAddress])

    const updateExistingProject = useCallback(async () => {
        if (!projectId) {
            throw new Error('No project')
        }

        setPublishInProgress(true)

        try {
            const projectContractData = await getSmartContractProject(projectId)

            await toastedProjectOperation('Update project', () =>
                updateProject(projectContractData),
            )

            /**
             * @FIXME Prevent navigating to the project listing page if… the user
             * has already moved on.
             */
            history.push(routes.projects.index())
        } finally {
            setPublishInProgress(false)
        }
    }, [getSmartContractProject, projectId, history])

    const create = useCallback<ProjectController['create']>(async () => {
        checkValidationErrors()

        switch (projectType) {
            case ProjectType.PaidData:
            case ProjectType.OpenData:
                return createNewProject()
            case ProjectType.DataUnion:
                return createNewDataUnion()
        }

        throw new Error('Invalid project type')
    }, [projectType, checkValidationErrors, createNewProject, createNewDataUnion])

    const update = useCallback<ProjectController['update']>(async () => {
        checkValidationErrors()

        switch (projectType) {
            case ProjectType.PaidData:
            case ProjectType.OpenData:
            case ProjectType.DataUnion:
                return updateExistingProject()
        }

        throw new Error('Invalid project type')
    }, [
        projectType,
        checkValidationErrors,
        updateExistingProject,
    ])

    const deleteProject = useCallback<ProjectController['deleteProject']>(async () => {
        if (projectId == null) {
            return
        }

        setPublishInProgress(true)

        try {
            await toastedProjectOperation('Delete project', () =>
                deleteProjectService(projectId),
            )
        } finally {
            setPublishInProgress(false)
        }
    }, [projectId])

    return {
        create,
        update,
        deleteProject,
        publishInProgress,
    }
}

export const ProjectControllerContext = createContext<ProjectController>(null)

export const ProjectControllerProvider: FunctionComponent<{ children?: ReactNode }> = ({
    children,
}) => {
    return (
        <ProjectControllerContext.Provider value={useProjectController()}>
            {children}
        </ProjectControllerContext.Provider>
    )
}
