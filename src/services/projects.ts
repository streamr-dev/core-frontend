import { toaster } from 'toasterhea'
import { Address } from '~/shared/types/web3-types'
import { getSigner, getWalletAccount } from '~/shared/stores/wallet'
import { getProjectRegistryContract } from '~/getters'
import networkPreflight from '~/utils/networkPreflight'
import { deployDataUnion } from '~/marketplace/modules/dataUnion/services'
import { BN, toBN } from '~/utils/bn'
import {
    getRawGraphProject,
    getRawGraphProjects,
    getRawGraphProjectsByText,
} from '~/getters/hub'
import { getProjectRegistryChainId } from '~/getters'
import { Project, ProjectType, TheGraph } from '~/shared/types'
import { isMessagedObject } from '~/utils'
import { errorToast } from '~/utils/toast'
import { truncate } from '~/shared/utils/text'
import { PublishableProjectPayload } from '~/types/projects'
import { getTokenInfo } from '~/hooks/useTokenInfo'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { pricePerSecondFromTimeUnit } from '~/marketplace/utils/price'
import { postImage } from './images'

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

export const getProject = async (id: string): Promise<TheGraphProject | null> => {
    const project = await getRawGraphProject(id)

    if (project) {
        return mapProject(project)
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

export const getProjects = async (
    owner?: string | undefined,
    first = 20,
    skip = 0,
    projectType?: TheGraph.ProjectType | undefined,
    streamId?: string, // used to search projects which contain this stream
): Promise<ProjectsResult> => {
    const projects = await getRawGraphProjects({
        owner,
        first: first + 1,
        skip,
        projectType,
        streamId,
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

export const searchProjects = async (
    search: string,
    first = 20,
    skip = 0,
): Promise<ProjectsResult> => {
    const projects = await getRawGraphProjectsByText(search, {
        first: first + 1,
        skip,
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

async function formatMetadata({
    contact: contactDetails,
    creator,
    description,
    imageIpfsCid: existingImageIpfsCid,
    newImageToUpload,
    name,
    termsOfUse,
    type,
}: PublishableProjectPayload) {
    const imageIpfsCid = newImageToUpload
        ? await postImage(newImageToUpload)
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

export async function getPublishableProjectProperties(project: Project) {
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
            beneficiaryAddress || project.type === ProjectType.PaidData ? wallet : ''

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

    const metadata = await formatMetadata(payload)

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
    const chainId = getProjectRegistryChainId()

    await networkPreflight(chainId)

    const provider = await getSigner()

    const tx = await getProjectRegistryContract({
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

    await tx.wait()
}

export async function updateProject(
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
    const chainId = getProjectRegistryChainId()

    await networkPreflight(chainId)

    const provider = await getSigner()

    const tx = await getProjectRegistryContract({ chainId, provider }).updateProject(
        projectId,
        domainIds,
        paymentDetails,
        streams,
        minimumSubscriptionSeconds,
        metadata,
    )

    await tx.wait()
}

export async function deleteProject(projectId: string) {
    const chainId = getProjectRegistryChainId()

    await networkPreflight(chainId)

    const provider = await getSigner()

    try {
        const tx = await getProjectRegistryContract({
            chainId,
            provider,
        }).deleteProject(projectId)

        await tx.wait()
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
    projectId: string,
    adminFee: number,
    chainId: number,
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
