import getCoreConfig from '~/getters/getCoreConfig'
import { post } from '~/shared/utils/api'
import { Address } from '~/shared/types/web3-types'
import { getConfigForChainByName } from '~/shared/web3/config'
import address0 from '~/utils/address0'
import { getWalletWeb3Provider } from '~/shared/stores/wallet'
import { getGraphUrl, getProjectRegistryContract } from '~/getters'
import networkPreflight from '~/utils/networkPreflight'
import { deployDataUnion } from '~/marketplace/modules/dataUnion/services'
import { BN } from '~/utils/bn'

const getProjectRegistryChainId = () => {
    const { projectsChain } = getCoreConfig()
    const config = getConfigForChainByName(projectsChain)
    return config.id
}

export type TheGraphPaymentDetails = {
    domainId: string
    beneficiary: string
    pricingTokenAddress: string
    pricePerSecond: string
}

export type TheGraphSubscription = {
    userAddress: string
    endTimestamp: string
}

export type ProjectPermissions = {
    canBuy: boolean
    canDelete: boolean
    canEdit: boolean
    canGrant: boolean
}

export type TheGraphPermission = ProjectPermissions & {
    userAddress: string
}

export type TheGraphPurchase = {
    subscriber: string
    subscriptionSeconds: string
    price: string
    fee: string
}

export type TheGraphProject = {
    id: string
    paymentDetails: TheGraphPaymentDetails[]
    minimumSubscriptionSeconds: string
    subscriptions: TheGraphSubscription[]
    metadata: SmartContractProjectMetadata
    version: number | null
    streams: string[]
    permissions: TheGraphPermission[]
    createdAt: string
    updatedAt: string
    purchases: TheGraphPurchase[]
    purchasesCount: number
    isDataUnion: boolean
}

export type PaymentDetails = {
    chainId: number
    beneficiaryAddress: Address
    pricePerSecond: BN
    pricingTokenAddress: Address
}

export type SmartContractProjectMetadata = {
    name: string
    description: string
    imageIpfsCid: string | null | undefined
    creator: string
    termsOfUse:
        | {
              commercialUse: boolean
              redistribution: boolean
              reselling: boolean
              storage: boolean
              termsName: string | null | undefined
              termsUrl: string | null | undefined
          }
        | undefined
    contactDetails:
        | {
              url?: string | null | undefined
              email?: string | null | undefined
              twitter?: string | null | undefined
              telegram?: string | null | undefined
              reddit?: string | null | undefined
              linkedIn?: string | null | undefined
          }
        | undefined
    isDataUnion?: boolean
}

export type SmartContractProject = {
    id: string
    paymentDetails: PaymentDetails[]
    minimumSubscriptionInSeconds: number
    metadata: string
    chainId: number
    streams: string[]
}

export interface SmartContractProjectCreate extends SmartContractProject {
    isPublicPurchasable: boolean
}

type SmartContractPaymentDetails = {
    beneficiary: string
    pricePerSecond: string
    pricingTokenAddress: string
}

const projectFields = `
    id
    domainIds
    score
    metadata
    streams
    minimumSubscriptionSeconds
    createdAt
    updatedAt
    isDataUnion
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

export enum ProjectListingTypeFilter {
    openData = 'openData',
    paidData = 'paidData',
    dataUnion = 'dataUnion',
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
        },
    })

    if (result.data) {
        const projects = result.data.projects.map((p) => mapProject(p))
        if (projects && projects.length > 0) {
            return projects[0]
        }
    }

    return null
}

const prepareProjectResult = (
    results: TheGraphProject[],
    pageSize: number,
): ProjectsResult => {
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
    projects: TheGraphProject[]
    hasNextPage: boolean
    lastId: string | null
}

const getProjectFilterQuery = (type: ProjectListingTypeFilter): string => {
    switch (type) {
        case ProjectListingTypeFilter.openData:
            return `paymentDetails_: {beneficiary: "${address0}"}`
        case ProjectListingTypeFilter.paidData:
            return `paymentDetails_: {beneficiary_not: "${address0}"}`
        case ProjectListingTypeFilter.dataUnion:
            return `isDataUnion: true`
    }
}

export const getProjects = async (
    owner?: string | undefined,
    first = 20,
    skip = 0,
    type?: ProjectListingTypeFilter | undefined,
    streamId?: string | null, // used to search projects which contain this stream
): Promise<ProjectsResult> => {
    const theGraphUrl = getGraphUrl()

    const filters: string[] = []
    if (owner) {
        filters.push(`permissions_: { userAddress: "${owner}", canGrant: true }`)
    }
    if (type) {
        filters.push(getProjectFilterQuery(type))
    }
    if (streamId) {
        filters.push(`streams_contains: ["${streamId}"]`)
    }

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projects(
                        first: ${first + 1},
                        skip: ${skip},
                        orderBy: score,
                        orderDirection: desc,
                        ${filters.length > 0 ? `where: { ${filters} }` : ''},
                    ) {
                        ${projectFields}
                    }
                }
            `,
        },
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

export const searchProjects = async (
    search: string,
    first = 20,
    skip = 0,
    type?: ProjectListingTypeFilter | null,
): Promise<ProjectsResult> => {
    const theGraphUrl = getGraphUrl()
    const typeFilter = type != null ? getProjectFilterQuery(type) : null

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    projectSearch(
                        first: ${first + 1},
                        skip: ${skip},
                        text: "${search}",
                        ${typeFilter !== null ? `where: {${typeFilter}}` : ''}
                    ) {
                        ${projectFields}
                    }
                }
            `,
        },
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

const getDomainIds = (paymentDetails: PaymentDetails[]): number[] => {
    return paymentDetails.map((p) => p.chainId)
}

const getPaymentDetails = (
    paymentDetails: PaymentDetails[],
): SmartContractPaymentDetails[] => {
    return paymentDetails.map((d) => ({
        beneficiary: d.beneficiaryAddress,
        pricingTokenAddress: d.pricingTokenAddress,
        pricePerSecond: d.pricePerSecond.toString(),
    }))
}

export async function createProject(project: SmartContractProjectCreate) {
    const chainId = getProjectRegistryChainId()

    const {
        id,
        paymentDetails,
        streams,
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    } = project

    await networkPreflight(chainId)

    const signer = await getWalletWeb3Provider()

    const tx = await getProjectRegistryContract({
        chainId,
        signer,
    }).createProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        streams,
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    )

    await tx.wait()
}

export async function updateProject(project: SmartContractProject) {
    const chainId = getProjectRegistryChainId()

    const { id, paymentDetails, streams, minimumSubscriptionInSeconds, metadata } =
        project

    await networkPreflight(chainId)

    const signer = await getWalletWeb3Provider()

    const tx = await getProjectRegistryContract({ chainId, signer }).updateProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        streams,
        minimumSubscriptionInSeconds,
        metadata,
    )

    await tx.wait()
}

export async function deleteProject(projectId: string | undefined) {
    if (!projectId) {
        throw new Error('No project')
    }

    const chainId = getProjectRegistryChainId()

    await networkPreflight(chainId)

    const signer = await getWalletWeb3Provider()

    const tx = await getProjectRegistryContract({
        chainId,
        signer,
    }).deleteProject(projectId)

    await tx.wait()
}

export async function deployDataUnionContract(
    projectId: string,
    adminFee: string,
    chainId: number,
) {
    await networkPreflight(chainId)

    return new Promise<string>((resolve, reject) =>
        deployDataUnion({
            productId: projectId,
            chainId,
            adminFee,
        })
            .onTransactionHash((contractAddress) => {
                // deployDataUnion() returns the calculated contract address as the tx hash
            })
            .onTransactionComplete(({ contractAddress }) => {
                if (contractAddress == null) {
                    reject(new Error('DU contract deploy did not return an address!'))
                } else {
                    resolve(contractAddress)
                }
            })
            .onError((e) => {
                console.error(e)
                reject(e)
            }),
    )
}
