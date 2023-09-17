import { Address } from '~/shared/types/web3-types'
import { getSigner } from '~/shared/stores/wallet'
import { getProjectRegistryContract } from '~/getters'
import networkPreflight from '~/utils/networkPreflight'
import { deployDataUnion } from '~/marketplace/modules/dataUnion/services'
import { BN } from '~/utils/bn'
import {
    getRawGraphProject,
    getRawGraphProjects,
    getRawGraphProjectsByText,
} from '~/getters/hub'
import { getProjectRegistryChainId } from '~/getters'
import { Project, ProjectType, TheGraph } from '~/shared/types'
import { isMessaged } from '~/utils'
import { errorToast } from '~/utils/toast'
import { ContractTransaction } from 'ethers'
import { truncate } from '~/shared/utils/text'
import { randomHex } from 'web3-utils'
import { PublishableProjectPayload } from '~/types/projects'
import { getTokenInfo } from '~/hooks/useTokenInfo'
import { toaster } from 'toasterhea'
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

type SmartContractPaymentDetails = {
    beneficiary: string
    pricePerSecond: string
    pricingTokenAddress: string
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

async function prepare(project: Project) {
    const payload = PublishableProjectPayload.parse(project)

    const salePoints = Object.values(payload.salePoints)

    let domainIds: number[] = []

    let paymentDetails: {
        beneficiary: string
        pricingTokenAddress: string
        pricePerSecond: string
    }[] = []

    for (let i = 0; i < salePoints.length; i++) {
        const {
            chainId: domainId,
            enabled,
            beneficiaryAddress: beneficiary,
            pricingTokenAddress,
            price,
            timeUnit,
        } = salePoints[i]

        if (!enabled) {
            continue
        }

        let pricePerSecond = '0'

        if (price !== '0') {
            /**
             * 0 tokens per time unit constitues 0 per second. No need
             * to fetch decimals.
             */
            let decimals: number | undefined

            while (true) {
                try {
                    decimals = (await getTokenInfo(pricingTokenAddress, domainId))
                        .decimals

                    break
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

            pricePerSecond = pricePerSecondFromTimeUnit(
                price,
                timeUnit,
                decimals,
            ).toString()
        }

        domainIds.push(domainId)

        paymentDetails.push({
            beneficiary,
            pricePerSecond,
            pricingTokenAddress,
        })
    }

    const metadata = await formatMetadata(payload)

    return {
        domainIds,
        paymentDetails,
        streams: payload.streams,
        metadata,
    }
}

export async function createProject2(project: Project) {
    const { domainIds, paymentDetails, streams, metadata } = await prepare(project)

    const chainId = getProjectRegistryChainId()

    const id = randomHex(32)

    await networkPreflight(chainId)

    const provider = await getSigner()

    const tx = await getProjectRegistryContract({
        chainId,
        provider,
    }).createProject(
        id,
        domainIds,
        paymentDetails,
        streams,
        0,
        project.type !== ProjectType.OpenData,
        metadata,
    )

    await tx.wait()
}

export async function updataProject2(project: Project) {
    const { id } = project

    if (!id) {
        throw new Error('Non-existing projects cannot be updated. Create it first.')
    }

    const { domainIds, paymentDetails, streams, metadata } = await prepare(project)

    const chainId = getProjectRegistryChainId()

    await networkPreflight(chainId)

    const provider = await getSigner()

    const tx = await getProjectRegistryContract({ chainId, provider }).updateProject(
        id,
        domainIds,
        paymentDetails,
        streams,
        0,
        metadata,
    )

    await tx.wait()
}

/**
 * @deprecated Use createProject2.
 */
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

    const signer = await getSigner()

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

/**
 * @deprecated Use updateProject2.
 */
export async function updateProject(project: SmartContractProject) {
    const chainId = getProjectRegistryChainId()

    const { id, paymentDetails, streams, minimumSubscriptionInSeconds, metadata } =
        project

    await networkPreflight(chainId)

    const signer = await getSigner()

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
        if (isMessaged(e) && /error_projectDoesNotExist/.test(e.message)) {
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
