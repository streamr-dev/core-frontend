import React, {createContext, FunctionComponent, ReactNode, useCallback, useMemo, useState} from 'react'
import {useHistory} from "react-router-dom"
import BN from "bignumber.js"
import {randomHex} from "web3-utils"
import {useProjectState} from '$mp/contexts/ProjectStateContext'
import {
    SeverityLevel,
    useValidationContext,
} from '$mp/containers/ProductController/ValidationContextProvider'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { ProjectTypeEnum } from '$mp/utils/constants'
import { postImage } from '$app/src/services/images'
import {
    createProject,
    SmartContractProject,
    SmartContractProjectCreate,
    SmartContractProjectMetadata, updateProject
} from '$app/src/services/projects'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChain } from '$shared/web3/config'
import { getDataAddress } from '$mp/utils/web3'
import address0 from "$utils/address0"
import {useProjectEditorStore} from "$mp/containers/ProjectEditing/proejctEditor.state"
import {TransactionList} from "$shared/components/TransactionList"
import routes from "$routes"

export type ProjectController = {
    create: () => Promise<boolean>,
    update: () => Promise<boolean>,
    publishInProgress: boolean
}

const ProjectTransactionList = () => {
    const persistOperations = useProjectEditorStore((state) => state.persistOperations)
    return <TransactionList operations={persistOperations}/>
}
export const useProjectController = (): ProjectController => {
    const {state: project} = useProjectState()
    const {validate} = useValidationContext()
    const [publishInProgress, setPublishInProgress] = useState<boolean>(false)
    const {projectRegistry} = getCoreConfig()
    const registryChain = getConfigForChain(projectRegistry.chainId)
    const history = useHistory()
    const addPersistOperation = useProjectEditorStore((state) => state.addPersistOperation)
    const updatePersistOperation = useProjectEditorStore((state) => state.updatePersistOperation)
    const clearPersistOperations = useProjectEditorStore((state) => state.clearPersistOperations)
    const TRANSACTION_LIST_TIMEOUT = 3000

    const openTransactionNotification = (): Notification => Notification.push({
        autoDismiss: false,
        dismissible: false,
        children: <ProjectTransactionList />,
    })

    const checkValidationErrors = useCallback((): boolean => {
        // Notify missing/invalid fields
        const validationResult = validate(project)
        const errors = Object.keys(validationResult)
            .filter((key) => validationResult[key] && validationResult[key].level === SeverityLevel.ERROR)
            .map((key) => ({
                key,
                message: validationResult[key].message,
            }))
        if (errors.length > 0) {
            errors.forEach(({ message }) => {
                Notification.push({
                    title: message,
                    icon: NotificationIcon.ERROR,
                })
            })
            return false
        }

        return true
    }, [project, validate])

    const getProjectMetadata = useCallback<() => Promise<SmartContractProjectMetadata>>(async () => {
        const metadata: SmartContractProjectMetadata = {
            name: project.name,
            description: project.description,
            imageIpfsCid: project.imageIpfsCid,
            creator: project.creator,
            contactDetails: {
                email: project.contact.email,
                url: project.contact.url,
                twitter: project.contact.twitter,
                telegram: project.contact.telegram,
                reddit: project.contact.reddit,
                linkedIn: project.contact.linkedIn
            },
            termsOfUse: {...project.termsOfUse}
        }
        if (project.newImageToUpload) {
            metadata.imageIpfsCid = await postImage(project.newImageToUpload)
        }
        return metadata
    }, [project])

    const getSmartContractProject = useCallback(async (id?: string): Promise<SmartContractProject> => {
        const metadata: SmartContractProjectMetadata = await getProjectMetadata()
        return {
            metadata: JSON.stringify(metadata),
            chainId: registryChain.id,
            id: id || randomHex(32),
            minimumSubscriptionInSeconds: 0,
            streams: [...project.streams],
            paymentDetails: project.type === ProjectTypeEnum.PAID_DATA ? Object.values(project.salePoints).map((salePoint) => {
                return {
                    chainId: salePoint.chainId,
                    beneficiaryAddress: salePoint.beneficiaryAddress,
                    pricePerSecond: salePoint.pricePerSecond,
                    pricingTokenAddress: salePoint.pricingTokenAddress
                }
            }) : [{
                chainId: registryChain.id,
                beneficiaryAddress: address0,
                pricePerSecond: new BN(0),
                pricingTokenAddress: getDataAddress(registryChain.id),
            }]

        }
    }, [getProjectMetadata, registryChain.id, project.streams, project.type, project.salePoints])

    const createNewProject = useCallback<() => Promise<boolean>>(async () => {
        clearPersistOperations()
        let transactionsToastNotification: Notification | null = null
        const projectContractData: SmartContractProjectCreate = {
            ...(await getSmartContractProject()),
            isPublicPurchasable: project.type !== ProjectTypeEnum.OPEN_DATA,
        }

        setPublishInProgress(true)
        addPersistOperation({id: 'createProject', name: 'Create project', type: 'project', state: 'notstarted'})

        transactionsToastNotification = openTransactionNotification()

        return new Promise((resolve) => {
            updatePersistOperation('createProject', {
                state: 'inprogress',
            })
            const transaction = createProject(projectContractData)
            transaction.onTransactionComplete(() => {
                updatePersistOperation('createProject', {
                    state: 'complete',
                })
                setTimeout(() => {
                    setPublishInProgress(false)
                    history.push(routes.projects.index())
                    transactionsToastNotification?.close()
                    resolve(true)
                }, TRANSACTION_LIST_TIMEOUT)
            })
            transaction.onError(() => {
                setPublishInProgress(false)
                updatePersistOperation('createProject', {
                    state: 'error',
                })
                setTimeout(() => {
                    transactionsToastNotification?.close()
                }, TRANSACTION_LIST_TIMEOUT)
                resolve(false)
            })
        })
    }, [project, getSmartContractProject])

    const createNewDataUnion = useCallback<() => Promise<boolean>>(async () => {
        // TODO
        return true
    }, [])

    const updateExistingProject = useCallback(async (): Promise<boolean> => {
        clearPersistOperations()
        let transactionsToastNotification: Notification | null = null
        const projectContractData = await getSmartContractProject(project.id)
        addPersistOperation({id: 'updateProject', name: 'Update project', type: 'project', state: 'notstarted'})
        setPublishInProgress(true)
        transactionsToastNotification = openTransactionNotification()
        return new Promise((resolve) => {
            updatePersistOperation('updateProject', {
                state: 'inprogress',
            })
            const transaction = updateProject(projectContractData)
            transaction.onTransactionComplete(() => {
                updatePersistOperation('updateProject', {
                    state: 'complete',
                })
                setTimeout(() => {
                    setPublishInProgress(false)
                    history.push(routes.projects.index())
                    transactionsToastNotification?.close()
                    resolve(true)
                }, TRANSACTION_LIST_TIMEOUT)
            })
            transaction.onError(() => {
                setPublishInProgress(false)
                updatePersistOperation('updateProject', {
                    state: 'error',
                })
                setTimeout(() => {
                    transactionsToastNotification?.close()
                }, TRANSACTION_LIST_TIMEOUT)
                resolve(false)
            })
        })
    }, [project, getSmartContractProject])

    const updateExistingDataUnion = useCallback(async (): Promise<boolean> => {
        // todo implementation
        return true
    }, [])

    const create = useCallback<ProjectController['create']>(async() => {
        if (checkValidationErrors()) {
            switch (project.type) {
                case ProjectTypeEnum.PAID_DATA:
                case ProjectTypeEnum.OPEN_DATA:
                    return await createNewProject()
                case ProjectTypeEnum.DATA_UNION:
                    return await createNewDataUnion()
            }
        }
        return false
    }, [project, checkValidationErrors, createNewProject, createNewDataUnion])

    const update = useCallback<ProjectController['update']>(async () => {
        if (checkValidationErrors()) {
            switch (project.type) {
                case ProjectTypeEnum.PAID_DATA:
                case ProjectTypeEnum.OPEN_DATA:
                    return await updateExistingProject()
                case ProjectTypeEnum.DATA_UNION:
                    return await updateExistingDataUnion()
            }
        }
        return true
    }, [checkValidationErrors, project.type, updateExistingProject, updateExistingDataUnion])
    return {
        create,
        update,
        publishInProgress
    }
}

export const ProjectControllerContext = createContext<ProjectController>(null)

export const ProjectControllerProvider: FunctionComponent<{children?: ReactNode}> = ({children}) => {
    return <ProjectControllerContext.Provider value={useProjectController()}>{children}</ProjectControllerContext.Provider>
}
