import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import BN from "bignumber.js"
import getCoreConfig from "$app/src/getters/getCoreConfig"
import { post } from "$shared/utils/api"
import { call, getContract } from '$mp/utils/smartContract'
import { send } from '$mp/utils/smartContract'
import {Address, SmartContractCall, SmartContractTransaction} from "$shared/types/web3-types"
import { getConfigForChain, getConfigForChainByName } from '$shared/web3/config'
import projectRegistryAbi from '$shared/web3/abis/projectRegistry.json'
import {ProjectId} from "$mp/types/project-types"

const getGraphUrl = () => {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()
    return `${theGraphUrl}/subgraphs/name/${theHubGraphName}`
}

const getProjectRegistryChainId = () => {
    const { projectsChain } = getCoreConfig()
    const config = getConfigForChainByName(projectsChain)
    return config.id
}

export type TheGraphPaymentDetails = {
    domainId: string,
    beneficiary: string,
    pricingTokenAddress: string,
    pricePerSecond: string,
}

export type TheGraphSubscription = {
    userAddress: string,
    endTimestamp: string,
}

export type ProjectPermissions = {
    canBuy: boolean,
    canDelete: boolean,
    canEdit: boolean,
    canGrant: boolean,
}

export type TheGraphPermission = ProjectPermissions & {
    userAddress: string,
}

export type TheGraphPurchase = {
    subscriber: string,
    subscriptionSeconds: string,
    price: string,
    fee: string,
}

export type TheGraphProject = {
    id: string,
    paymentDetails: TheGraphPaymentDetails[],
    minimumSubscriptionSeconds: string,
    subscriptions: TheGraphSubscription[],
    metadata: SmartContractProjectMetadata,
    version: number | null,
    streams: string[],
    permissions: TheGraphPermission[],
    createdAt: string,
    updatedAt: string,
    purchases: TheGraphPurchase[],
    purchasesCount: number,
}

export type PaymentDetails = {
    chainId: number,
    beneficiaryAddress: Address,
    pricePerSecond: BN,
    pricingTokenAddress: Address,
}

export type SmartContractProjectMetadata = {
    name: string,
    description: string,
    imageUrl: string,
    creator: string,
    termsOfUse: {
        commercialUse: boolean
        redistribution: boolean
        reselling: boolean
        storage: boolean
        termsName: string | null | undefined
        termsUrl: string | null | undefined
    } | undefined,
    contactDetails: {
        url?: string | null | undefined
        email?: string | null | undefined
        twitter?: string | null | undefined
        telegram?: string | null | undefined
        reddit?: string | null | undefined
        linkedIn?: string | null | undefined
    } | undefined,
    isDataUnion: boolean,
}

export type SmartContractProject = {
    id: string,
    paymentDetails: PaymentDetails[],
    minimumSubscriptionInSeconds: number,
    metadata: string,
    chainId: number,
    streams: string[],
}

export interface SmartContractProjectCreate extends SmartContractProject {
    isPublicPurchasable: boolean,
}

type SmartContractPaymentDetails = {
    beneficiary: string,
    pricePerSecond: string,
    pricingTokenAddress: string,
}

const projectFields = `
    id
    counter
    domainIds
    score
    metadata
    version
    streams
    minimumSubscriptionSeconds
    createdAt
    updatedAt
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
`

const mapProject = (project: any): TheGraphProject => {
    try {
        const metadata = JSON.parse(project.metadata)
        project.metadata = metadata
    } catch (e) {
        console.error(`Could not parse metadata for project ${project.id}`, e)
        project.metadata = {}
    }

    return project as TheGraphProject
}

export const getProject = async (id: string): Promise<TheGraphProject | null> => {
    const theGraphUrl = getGraphUrl()

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projects(
                        where: { id: "${id.toLowerCase()}" }
                    ) {
                        ${projectFields}
                    }
                }
            `,
        }
    })

    if (result.data) {
        const projects = result.data.projects.map((p) => mapProject(p))
        if (projects && projects.length > 0) {
            return projects[0]
        }
    }

    return null
}

const prepareProjectResult = (results: TheGraphProject[], pageSize: number): ProjectsResult => {
    let hasNextPage = false

    const projects: TheGraphProject[] = results.map((p) => mapProject(p))
    if (projects.length > pageSize) {
        hasNextPage = true
        // Remove last item
        projects.splice(pageSize, 1)
    }

    return {
        projects,
        hasNextPage,
        lastId: projects.length === 0 ? null : projects[projects.length - 1].id,
    }
}

export type ProjectsResult = {
    projects: TheGraphProject[],
    hasNextPage: boolean,
    lastId: string,
}

export const getProjects = async (owner?: string, first = 20, skip = 0): Promise<ProjectsResult> => {
    const theGraphUrl = getGraphUrl()

    const ownerFilter = owner != null ? `permissions_: { userAddress: "${owner}", canGrant: true }` : null
    const allFilters = [ownerFilter].join(',')

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projects(
                        first: ${first + 1},
                        skip: ${skip},
                        ${allFilters != null && `where: { ${allFilters} }`},
                    ) {
                        ${projectFields}
                    }
                }
            `,
        }
    })

    if (result.data) {
        return prepareProjectResult(result.data.projects, first)
    }

    return {
        projects: [],
        hasNextPage: false,
        lastId: null,
    }
}

export const searchProjects = async (search: string, first = 20, skip = 0): Promise<ProjectsResult> => {
    const theGraphUrl = getGraphUrl()

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projectSearch(
                        first: ${first + 1},
                        skip: ${skip},
                        text: "${search}",
                    ) {
                        ${projectFields}
                    }
                }
            `,
        }
    })

    if (result.data) {
        return prepareProjectResult(result.data.projectSearch, first)
    }

    return {
        projects: [],
        hasNextPage: false,
        lastId: null,
    }
}

const projectRegistryContract = (usePublicNode = false, chainId: number): Contract => {
    const { contracts } = getConfigForChain(chainId)
    const address = contracts.ProjectRegistryV1 || contracts.ProjectRegistry

    if (address == null) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    const contract = getContract({ abi: projectRegistryAbi as AbiItem[], address}, usePublicNode, chainId)
    return contract
}

const getDomainIds = (paymentDetails: PaymentDetails[]): number[] => {
    return paymentDetails.map((p) => p.chainId)
}

const getPaymentDetails = (paymentDetails: PaymentDetails[]): SmartContractPaymentDetails[] => {
    return paymentDetails.map((d) => ({
        beneficiary: d.beneficiaryAddress,
        pricingTokenAddress: d.pricingTokenAddress,
        pricePerSecond: d.pricePerSecond.toString(),
    }))
}

export const createProject = (project: SmartContractProjectCreate): SmartContractTransaction => {
    const chainId = getProjectRegistryChainId()
    const {
        id,
        paymentDetails,
        streams,
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    } = project

    const methodToSend = projectRegistryContract(false, chainId).methods.createProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        streams,
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const getUserPermissionsForProject = async (
    chainId: number,
    projectId: ProjectId,
    userAddress: Address,
): SmartContractCall<ProjectPermissions> => {
    const response = await projectRegistryContract(false, chainId).methods.getPermission(projectId, userAddress).call()
    const { canDelete, canEdit, canGrant, canBuy } = response
    return { canDelete, canEdit, canGrant, canBuy }
}

export const updateProject = (project: SmartContractProject): SmartContractTransaction => {
    const chainId = getProjectRegistryChainId()
    const {
        id,
        paymentDetails,
        streams,
        minimumSubscriptionInSeconds,
        metadata,
    } = project

    const methodToSend = projectRegistryContract(false, chainId).methods.updateProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        streams,
        minimumSubscriptionInSeconds,
        metadata,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const deleteProject = (project: SmartContractProject): SmartContractTransaction => {
    const chainId = getProjectRegistryChainId()
    const {
        id
    } = project

    const methodToSend = projectRegistryContract(false, chainId).methods.deleteProject(
        id,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const getProjectFromRegistry =
    async (id: string, domainIds: Array<string>, usePublicNode = true): SmartContractCall<SmartContractProject> => {
        const chainId = getProjectRegistryChainId()
        const result = await call(projectRegistryContract(usePublicNode, chainId).methods.getProject(id, domainIds))
        const project: SmartContractProject = {
            ...result,
            id: id,
            chainId: chainId,
        }
        return project
    }
