import BN from 'bignumber.js'
import { Toaster, toaster } from 'toasterhea'
import uniqueId from 'lodash/uniqueId'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { post } from '$shared/utils/api'
import { Address } from '$shared/types/web3-types'
import { getConfigForChainByName } from '$shared/web3/config'
import address0 from '$utils/address0'
import { getWalletWeb3Provider } from '$shared/stores/wallet'
import TransactionListToast, {
    Operation,
    notify,
} from '$shared/toasts/TransactionListToast'
import { Layer } from '$utils/Layer'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { getGraphUrl, getProjectRegistryContract } from '$app/src/getters'
import networkPreflight from '$utils/networkPreflight'

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
    counter
    domainIds
    score
    metadata
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
            // TODO implement
            return null
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

export async function createProject(project: SmartContractProjectCreate) {
    await toastedProjectOperation('Create project', async () => {
        const chainId = getProjectRegistryChainId()

        const {
            id,
            paymentDetails,
            streams,
            minimumSubscriptionInSeconds,
            isPublicPurchasable,
            metadata,
        } = project

        const from = await getDefaultWeb3Account()

        await networkPreflight(chainId)

        const web3 = await getWalletWeb3Provider()

        await new Promise<void>((resolve, reject) => {
            getProjectRegistryContract({ chainId, web3 })
                .methods.createProject(
                    id,
                    getDomainIds(paymentDetails),
                    getPaymentDetails(paymentDetails),
                    streams,
                    minimumSubscriptionInSeconds,
                    isPublicPurchasable,
                    metadata,
                )
                .send({
                    from,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                })
                .on('error', (error: unknown) => {
                    reject(error)
                })
                .once('confirmation', () => {
                    resolve()
                })
        })
    })
}

export async function updateProject(project: SmartContractProject) {
    await toastedProjectOperation('Update project', async () => {
        const chainId = getProjectRegistryChainId()

        const { id, paymentDetails, streams, minimumSubscriptionInSeconds, metadata } =
            project

        const from = await getDefaultWeb3Account()

        await networkPreflight(chainId)

        const web3 = await getWalletWeb3Provider()

        await new Promise<void>((resolve, reject) => {
            getProjectRegistryContract({ chainId, web3 })
                .methods.updateProject(
                    id,
                    getDomainIds(paymentDetails),
                    getPaymentDetails(paymentDetails),
                    streams,
                    minimumSubscriptionInSeconds,
                    metadata,
                )
                .send({
                    from,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                })
                .on('error', (error: unknown) => {
                    reject(error)
                })
                .once('confirmation', () => {
                    resolve()
                })
        })
    })
}

export async function deleteProject(projectId: string | undefined) {
    await toastedProjectOperation('Delete project', async () => {
        if (!projectId) {
            throw new Error('No project')
        }

        const chainId = getProjectRegistryChainId()

        const from = await getDefaultWeb3Account()

        await networkPreflight(chainId)

        const web3 = await getWalletWeb3Provider()

        await new Promise<void>((resolve, reject) => {
            getProjectRegistryContract({ chainId, web3 })
                .methods.deleteProject(projectId)
                .send({
                    from,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                })
                .on('error', (error: unknown) => {
                    reject(error)
                })
                .once('confirmation', () => {
                    resolve()
                })
        })
    })
}
