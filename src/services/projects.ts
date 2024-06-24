import { toaster } from 'toasterhea'
import { getSigner, getWalletAccount } from '~/shared/stores/wallet'
import { getProjectRegistryContract } from '~/getters'
import networkPreflight from '~/utils/networkPreflight'
import { deployDataUnion } from '~/marketplace/modules/dataUnion/services'
import { BN, toBN } from '~/utils/bn'
import { ProjectType, TheGraph } from '~/shared/types'
import { isMessagedObject } from '~/utils/exceptions'
import { errorToast } from '~/utils/toast'
import { truncate } from '~/shared/utils/text'
import { PublishableProjectPayload } from '~/types/projects'
import { getTokenInfo } from '~/utils/tokens'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { pricePerSecondFromTimeUnit } from '~/marketplace/utils/price'
import { ParsedProject } from '~/parsers/ProjectParser'
import {
    GetProjectsByTextDocument,
    GetProjectsByTextQuery,
    GetProjectsByTextQueryVariables,
    GetProjectsDocument,
    GetProjectsQuery,
    GetProjectsQueryVariables,
    Project_Filter,
} from '~/generated/gql/network'
import { getGraphClient } from '~/getters/getGraphClient'
import { postImage } from './images'

/**
 * @todo Let's shake off the unnecessary types.
 */

export type TheGraphPaymentDetails = {
    domainId: string
    beneficiary: string
    pricingTokenAddress: string
    pricePerSecond: string
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
    beneficiaryAddress: string
    pricePerSecond: BN
    pricingTokenAddress: string
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

const mapProject = (project: any): TheGraphProject => {
    let metadata = {}

    try {
        metadata = JSON.parse(project.metadata)
    } catch (e) {
        console.warn('Could not parse metadata for project', project.id, e)
    }

    return {
        ...project,
        metadata,
    }
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

function getProjectFilter(
    params: Pick<GetProjectsParams, 'owner' | 'streamId' | 'projectType'>,
): Project_Filter {
    const { owner, projectType, streamId } = params

    const filter: Project_Filter = {}

    if (projectType === TheGraph.ProjectType.Open) {
        filter.paymentDetails_ = {
            pricePerSecond: 0,
        }
    }

    if (projectType === TheGraph.ProjectType.Paid) {
        filter.paymentDetails_ = {
            pricePerSecond_gt: 0,
        }
    }

    if (projectType === TheGraph.ProjectType.DataUnion) {
        filter.isDataUnion = true
    }

    if (owner) {
        filter.permissions_ = {
            userAddress: owner,
            canGrant: true,
        }
    }

    if (streamId) {
        filter.streams_contains = [streamId]
    }

    return filter
}

interface GetProjectsParams {
    chainId: number
    first?: number
    owner?: string | undefined
    projectType?: TheGraph.ProjectType | undefined
    skip?: number
    /**
     * `streamId` use used to search projects which contain this stream.
     */
    streamId?: string | undefined
}

/**
 * @todo Refactor to use `ProjectParser` and `useInfiniteQuery`.
 */
export async function getProjects(params: GetProjectsParams): Promise<ProjectsResult> {
    const { chainId, first = 20, owner, projectType, skip = 0, streamId } = params

    const {
        data: { projects = [] },
    } = await getGraphClient(chainId).query<GetProjectsQuery, GetProjectsQueryVariables>({
        query: GetProjectsDocument,
        variables: {
            skip,
            first: first + 1,
            where: getProjectFilter({
                owner,
                projectType,
                streamId,
            }),
        },
        fetchPolicy: 'network-only',
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

/**
 * @todo Refactor to use `ProjectParser`.
 */
export async function getProjectsByText(text: string, params: GetProjectsParams) {
    const { chainId, first = 20, owner, projectType, skip = 0, streamId } = params

    const {
        data: { projectSearch: projects = [] },
    } = await getGraphClient(chainId).query<
        GetProjectsByTextQuery,
        GetProjectsByTextQueryVariables
    >({
        query: GetProjectsByTextDocument,
        variables: {
            first,
            skip,
            text,
            where: getProjectFilter({
                owner,
                projectType,
                streamId,
            }),
        },
        fetchPolicy: 'network-only',
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

async function formatMetadata(
    chainId: number,
    {
        contact: contactDetails,
        creator,
        description,
        imageIpfsCid: existingImageIpfsCid,
        newImageToUpload,
        name,
        termsOfUse,
        type,
    }: PublishableProjectPayload,
) {
    const imageIpfsCid = newImageToUpload
        ? await postImage(chainId, newImageToUpload)
        : existingImageIpfsCid

    return JSON.stringify({
        name,
        description,
        imageIpfsCid,
        creator,
        contactDetails,
        termsOfUse,
        isDataUnion: type === ProjectType.DataUnion,
    })
}

export async function getPublishableProjectProperties(project: ParsedProject) {
    const { chainId } = project

    const payload = PublishableProjectPayload.parse(project)

    const salePoints = Object.values(payload.salePoints)

    const domainIds: number[] = []

    const paymentDetails: {
        beneficiary: string
        pricingTokenAddress: string
        pricePerSecond: string
    }[] = []

    const wallet = (await getWalletAccount()) || ''

    for (let i = 0; i < salePoints.length; i++) {
        const {
            beneficiaryAddress,
            chainId: domainId,
            enabled,
            price,
            pricePerSecond: initialPricePerSecond,
            pricingTokenAddress,
            timeUnit,
        } = salePoints[i]

        if (!enabled) {
            continue
        }

        /**
         * Use current wallet's address as the default beneficiary for *paid* projects
         * that carry no beneficiary address information. The placeholder for the
         * beneficiary address input field reflects it, too.
         */
        const beneficiary =
            beneficiaryAddress || (payload.type === ProjectType.PaidData ? wallet : '')

        const pricePerSecond = await (async () => {
            if (initialPricePerSecond) {
                /**
                 * In the current implementation we disallow price changes, so
                 * if initial `pricePerSecond` is defined we reuse it.
                 */
                return initialPricePerSecond
            }

            if (price === '0') {
                /**
                 * 0 tokens per time unit constitues 0 per second. No need
                 * to fetch decimals.
                 */
                return '0'
            }

            while (true) {
                try {
                    const decimals = (await getTokenInfo(pricingTokenAddress, domainId))
                        .decimals

                    return pricePerSecondFromTimeUnit(
                        price,
                        timeUnit,
                        decimals,
                    ).toString()
                } catch (e) {
                    try {
                        await toaster(Toast, Layer.Toast).pop({
                            title: 'Warning',
                            type: ToastType.Warning,
                            desc: `Failed to fetch decimals for ${truncate(
                                pricingTokenAddress,
                            )}. Would you like to try again?`,
                            okLabel: 'Yes',
                            cancelLabel: 'No',
                        })

                        continue
                    } catch (_) {
                        throw e
                    }
                }
            }
        })()

        domainIds.push(domainId)

        paymentDetails.push({
            beneficiary,
            pricePerSecond,
            pricingTokenAddress,
        })
    }

    const metadata = await formatMetadata(chainId, payload)

    return {
        adminFee:
            'adminFee' in payload
                ? toBN(payload.adminFee).dividedBy(100).toNumber()
                : void 0,
        domainIds,
        metadata,
        paymentDetails,
        streams: payload.streams,
    }
}

export async function createProject(
    chainId: number,
    projectId: string,
    {
        domainIds,
        isPublicPurchasable,
        metadata,
        minimumSubscriptionSeconds = 0,
        paymentDetails,
        streams,
    }: {
        domainIds: number[]
        isPublicPurchasable: boolean
        metadata: string
        minimumSubscriptionSeconds?: number
        paymentDetails: {
            beneficiary: string
            pricingTokenAddress: string
            pricePerSecond: string
        }[]
        streams: string[]
    },
) {
    await networkPreflight(chainId)

    const provider = await getSigner()

    await getProjectRegistryContract({
        chainId,
        provider,
    }).createProject(
        projectId,
        domainIds,
        paymentDetails,
        streams,
        minimumSubscriptionSeconds,
        isPublicPurchasable,
        metadata,
    )
}

export async function updateProject(
    chainId: number,
    projectId: string,
    {
        domainIds,
        metadata,
        minimumSubscriptionSeconds = 0,
        paymentDetails,
        streams,
    }: {
        domainIds: number[]
        metadata: string
        minimumSubscriptionSeconds?: number
        paymentDetails: {
            beneficiary: string
            pricingTokenAddress: string
            pricePerSecond: string
        }[]
        streams: string[]
    },
) {
    await networkPreflight(chainId)

    const provider = await getSigner()

    await getProjectRegistryContract({ chainId, provider }).updateProject(
        projectId,
        domainIds,
        paymentDetails,
        streams,
        minimumSubscriptionSeconds,
        metadata,
    )
}

export async function deleteProject(chainId: number, projectId: string) {
    await networkPreflight(chainId)

    const provider = await getSigner()

    try {
        await getProjectRegistryContract({
            chainId,
            provider,
        }).deleteProject(projectId)
    } catch (e) {
        if (isMessagedObject(e) && /error_projectDoesNotExist/.test(e.message)) {
            errorToast({
                title: 'No such project',
                desc: `Project ${truncate(projectId)} does not exist.`,
            })
        }

        throw e
    }
}

export async function deployDataUnionContract(
    chainId: number,
    projectId: string,
    adminFee: number,
) {
    await networkPreflight(chainId)

    return new Promise<string>((resolve, reject) =>
        deployDataUnion({
            productId: projectId,
            chainId,
            adminFee,
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
