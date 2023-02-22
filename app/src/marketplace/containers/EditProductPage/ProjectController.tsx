import React, { createContext, FunctionComponent, ReactNode, useCallback, useState } from 'react'
import {randomHex} from "web3-utils"
import {useProjectState} from '$mp/contexts/ProjectStateContext'
import {
    SeverityLevel,
    useValidationContext,
} from '$mp/containers/ProductController/ValidationContextProvider2'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { ProjectTypeEnum } from '$mp/utils/constants'
import { postImage } from '$app/src/services/images'
import { createProject, SmartContractProjectCreate, SmartContractProjectMetadata } from '$app/src/services/projects'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChain } from '$shared/web3/config'
import { getDataAddress } from '$mp/utils/web3'
import address0 from "$utils/address0"

export type ProjectController = {
    create: () => Promise<boolean>,
    update: () => Promise<boolean>,
    publishInProgress: boolean
}

export const useProjectController = (): ProjectController => {
    const {state: project} = useProjectState()
    const {validate} = useValidationContext()
    const [publishInProgress, setPublishInProgress] = useState<boolean>(false)
    const {projectRegistry} = getCoreConfig()
    const registryChain = getConfigForChain(projectRegistry.chainId)

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
    }, [project])

    const getProjectMetadata = useCallback<() => Promise<SmartContractProjectMetadata>>(async () => {
        const metadata: SmartContractProjectMetadata = {
            name: project.name,
            description: project.description,
            imageUrl: project.imageUrl,
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
            metadata.imageUrl = await postImage(project.newImageToUpload)
        }
        return metadata
    }, [project])

    const createNewProject = useCallback<() => Promise<boolean>>(async () => {
        const metadata: SmartContractProjectMetadata = await getProjectMetadata()

        const projectContractData: SmartContractProjectCreate = {
            isPublicPurchasable: project.type !== ProjectTypeEnum.OPEN_DATA,
            metadata: JSON.stringify(metadata),
            chainId: registryChain.id,
            id: randomHex(32),
            minimumSubscriptionInSeconds: 0,
            streams: [...project.streams],
            paymentDetails: project.type === ProjectTypeEnum.PAID_DATA ? Object.values(project.salePoints).map((salePoint) => {
                return {
                    chainId: salePoint.chainId,
                    beneficiaryAddress: salePoint.beneficiaryAddress,
                    pricePerSecond: Number(salePoint.pricePerSecond),
                    pricingTokenAddress: salePoint.pricingTokenAddress
                }
            }) : [{
                chainId: registryChain.id,
                beneficiaryAddress: address0,
                pricePerSecond: 0,
                pricingTokenAddress: getDataAddress(registryChain.id),
            }]

        }

        setPublishInProgress(true)
        return new Promise((resolve) => {
            const transaction = createProject(projectContractData)
            transaction.onTransactionComplete(() => {
                setPublishInProgress(false)
                // todo fine tune the wording
                Notification.push({
                    title: 'Published',
                    description: 'Your project was published!',
                    icon: NotificationIcon.CHECKMARK,
                })
                resolve(true)
            })
            transaction.onError(() => {
                setPublishInProgress(false)
                // todo fine tune the wording
                // more detailed error message?
                Notification.push({
                    title: 'Error',
                    description: 'An error occurred and your project was not published',
                    icon: NotificationIcon.ERROR,
                })
                resolve(false)
            })
        })
    }, [project, getProjectMetadata])

    const createNewDataUnion = useCallback<() => Promise<boolean>>(async () => {
        // TODO
        console.log('DATA UNIONS PUBLISHING TO BE IMPLEMENTED')
        return true
    }, [project, getProjectMetadata])

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
            // todo
            console.log('PRODUCT UPDATE TO BE IMPLEMENTED')
        }
        return true
    }, [project, checkValidationErrors])
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
