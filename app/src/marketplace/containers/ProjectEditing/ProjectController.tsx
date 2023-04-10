import React, {createContext, FunctionComponent, ReactNode, useCallback, useState} from 'react'
import BN from "bignumber.js"
import { z } from 'zod'
import {useHistory} from "react-router-dom"
import {randomHex} from "web3-utils"
import {useProjectState} from '$mp/contexts/ProjectStateContext'
import {
    SeverityLevel,
    useValidationContext,
} from '$mp/containers/ProductController/ValidationContextProvider'
import { ProjectType } from '$shared/types'
import { postImage } from '$app/src/services/images'
import {
    createProject,
    SmartContractProject,
    SmartContractProjectCreate,
    SmartContractProjectMetadata,
    updateProject,
} from '$app/src/services/projects'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { getConfigForChain } from '$shared/web3/config'
import { getDataAddress } from '$mp/utils/web3'
import address0 from "$utils/address0"
import { formatChainName } from '$shared/utils/chains'
import {ChainName, SalePoint} from "$mp/types/project-types"
import routes from "$routes"

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

export type ProjectController = {
    create: () => Promise<void>,
    update: () => Promise<void>,
    publishInProgress: boolean,
}

const SalePointSchema = z.object({
    chainId: z.number(),
    beneficiaryAddress: z.string(),
    pricePerSecond: z.instanceof(BN),
    pricingTokenAddress: z.string(),
})

export const useProjectController = (): ProjectController => {
    const {state: project} = useProjectState()
    const {validate} = useValidationContext()
    const [publishInProgress, setPublishInProgress] = useState<boolean>(false)
    const {projectRegistry} = getCoreConfig()
    const registryChain = getConfigForChain(projectRegistry.chainId)
    const history = useHistory()

    const { id: projectId, type: projectType } = project || {}

    const checkValidationErrors = useCallback(() => {
        if (!project) {
            throw new Error('No project')
        }

        const validationResult = validate(project)

        const errors = Object.keys(validationResult)
            .filter((key) => validationResult[key] && validationResult[key].level === SeverityLevel.ERROR)
            .map((key) => validationResult[key].message)

        const { salePoints = {} } = project

        Object.entries(salePoints).forEach(([networkName, salePoint]) => {
            if (!SalePointSchema.safeParse(salePoint).success) {
                errors.push(`Incomplete pricing information for ${formatChainName(networkName)}`)
            }
        })

        if (errors.length) {
            throw new ValidationError(errors)
        }
    }, [project, validate])

    const getProjectMetadata = useCallback<() => Promise<SmartContractProjectMetadata>>(async () => {
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
                linkedIn: project?.contact?.linkedIn
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
            paymentDetails: projectType === ProjectType.PaidData ? Object.values(project.salePoints).map((salePoint) => {
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
    }, [getProjectMetadata, registryChain.id, project.streams, projectType, project.salePoints])

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

            await createProject(projectContractData)

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
        throw new Error('Not implemented')
    }, [])

    const updateExistingProject = useCallback(async () => {
        if (!projectId) {
            throw new Error('No project')
        }

        setPublishInProgress(true)

        try {
            const projectContractData = await getSmartContractProject(projectId)

            await updateProject(projectContractData)

            /**
             * @FIXME Prevent navigating to the project listing page if… the user
             * has already moved on.
             */
            history.push(routes.projects.index())
        } finally {
            setPublishInProgress(false)
        }
    }, [getSmartContractProject, projectId, history])

    const updateExistingDataUnion = useCallback(async (): Promise<void> => {
        throw new Error('Not implemented')
    }, [])

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
                return updateExistingProject()
            case ProjectType.DataUnion:
                return updateExistingDataUnion()
        }

        throw new Error('Invalid project type')
    }, [projectType, checkValidationErrors, updateExistingProject, updateExistingDataUnion])

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
