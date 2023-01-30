import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'

import getCoreConfig from "$app/src/getters/getCoreConfig"
import { post } from "$shared/utils/api"
import { getContract } from '$mp/utils/smartContract'
import { send } from '$mp/utils/smartContract'
import { Address, SmartContractTransaction } from "$shared/types/web3-types"
import { getConfigForChain } from '$shared/web3/config'
import projectRegistryAbi from '$shared/web3/abis/projectRegistry.json'

const getGraphUrl = () => {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()
    return `${theGraphUrl}/${theHubGraphName}`
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

export type TheGraphPermission = {
    userAddress: string,
    canBuy: boolean,
    canDelete: boolean,
    canEdit: boolean,
    canGrant: boolean,
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
    metadata: string,
    version: number | null,
    streams: string[],
    permissions: TheGraphPermission[],
    createdAt: string,
    updatedAt: string,
    purchases: TheGraphPurchase[],
    purchasesCount: number,
}

const projectFields = `
    id
    paymentDetails {
        domainId,
        beneficiary
        pricingTokenAddress
        pricePerSecond
    }
    minimumSubscriptionSeconds
    subscriptions {
        userAddress
        endTimestamp
    }
    metadata
    version
    streams
    permissions {
        userAddress
        canBuy
        canDelete
        canEdit
        canGrant
    }
    createdAt
    updatedAt
    purchases {
        subscriber
        subscriptionSeconds
        price
        fee
    }
    purchasesCount
`

export const getAllProjects = async (): Promise<TheGraphProject[]> => {
    const theGraphUrl = getGraphUrl()

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projects {
                        ${projectFields}
                    }
                }
            `,
        },
        useAuthorization: false,
    })

    return result.data.projects
}

export const searchProjects = async (search: string): Promise<TheGraphProject[]> => {
    const theGraphUrl = getGraphUrl()

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projectSearch(text: "${search}") {
                        ${projectFields}
                    }
                }
            `,
        },
        useAuthorization: false,
    })

    return result.data.projectSearch
}

export const projectRegistryContract = (usePublicNode = false, chainId: number): Contract => {
    const { contracts } = getConfigForChain(chainId)
    const address = contracts.ProjectRegistry

    if (address == null) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    const contract = getContract({ abi: projectRegistryAbi as AbiItem[], address}, usePublicNode, chainId)
    return contract
}

export type PaymentDetails = {
    chainId: number,
    beneficiaryAddress: Address,
    pricePerSecond: number,
    pricingTokenAddress: Address,
}

export type SmartContractProject = {
    id: string,
    paymentDetails: PaymentDetails[],
    minimumSubscriptionInSeconds: number,
    isPublicPurchasable: boolean,
    metadata: string,
    chainId: number,
}

type SmartContractPaymentDetails = {
    beneficiary: string,
    pricePerSecond: number,
    pricingTokenAddress: string,
}

const getDomainIds = (paymentDetails: PaymentDetails[]): number[] => {
    return paymentDetails.map((p) => p.chainId)
}

const getPaymentDetails = (paymentDetails: PaymentDetails[]): SmartContractPaymentDetails[] => {
    return paymentDetails.map((d) => ({
        beneficiary: d.beneficiaryAddress,
        pricingTokenAddress: d.pricingTokenAddress,
        pricePerSecond: d.pricePerSecond,
    }))
}

export const createProject = (project: SmartContractProject): SmartContractTransaction => {
    const {
        id,
        paymentDetails,
        minimumSubscriptionInSeconds,
        chainId,
        isPublicPurchasable,
        metadata,
    } = project

    const methodToSend = projectRegistryContract(false, chainId).methods.createProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const updateProject = (project: SmartContractProject): SmartContractTransaction => {
    const {
        id,
        paymentDetails,
        minimumSubscriptionInSeconds,
        chainId,
        metadata,
    } = project

    const methodToSend = projectRegistryContract(false, chainId).methods.updateProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        minimumSubscriptionInSeconds,
        metadata,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const deleteProject = (project: SmartContractProject): SmartContractTransaction => {
    const {
        id,
        chainId,
    } = project

    const methodToSend = projectRegistryContract(false, chainId).methods.deleteProject(
        id,
    )
    return send(methodToSend, {
        network: chainId,
    })
}

export const addStreamToProject = (projectId: string, streamId: string, chainId: number): SmartContractTransaction => {
    const methodToSend = projectRegistryContract(false, chainId).methods.addStream(
        projectId,
        streamId,
    )
    return send(methodToSend, {
        network: chainId,
        gas: 8e6,
    })
}

export const removeStreamFromProject = (projectId: string, streamId: string, chainId: number): SmartContractTransaction => {
    const methodToSend = projectRegistryContract(false, chainId).methods.removeStream(
        projectId,
        streamId,
    )
    return send(methodToSend, {
        network: chainId,
    })
}
