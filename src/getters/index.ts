import { Contract, Signer, providers } from 'ethers'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import {
    marketplaceV4ABI as marketplaceAbi,
    projectRegistryV1ABI as projectRegistryAbi,
    ProjectRegistryV1 as ProjectRegistryContract,
    MarketplaceV4 as MarketplaceContract,
} from '@streamr/hub-contracts'
import { getConfigForChain, getConfigForChainByName } from '~/shared/web3/config'
import reverseRecordsAbi from '~/shared/web3/abis/reverseRecords.json'
import {
    Token as TokenContract,
    ReverseRecords as ReverseRecordsContract,
} from '~/generated/types'
import { getMarketplaceAddress } from '~/marketplace/utils/web3'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { ProjectType } from '~/shared/types'
import tokenAbi from '~/shared/web3/abis/token.json'
import address0 from '~/utils/address0'
import { ProjectMetadata } from '~/shared/consts'
import {
    GetSponsorshipByIdQuery,
    GetSponsorshipByIdDocument,
    GetAllSponsorshipsQuery,
    GetAllSponsorshipsDocument,
    GetAllSponsorshipsQueryVariables,
    GetSponsorshipByIdQueryVariables,
    GetSponsorshipsByCreatorQuery,
    GetSponsorshipsByCreatorQueryVariables,
    GetSponsorshipsByCreatorDocument,
} from '~/generated/gql/network'
import getCoreConfig from './getCoreConfig'
import getGraphClient from './getGraphClient'

export function getGraphUrl() {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()

    return `${theGraphUrl}/subgraphs/name/${theHubGraphName}`
}

export function getProjectRegistryContract({
    chainId,
    signer,
}: {
    chainId: number
    signer?: Signer | providers.Provider
}) {
    const { contracts } = getConfigForChain(chainId)

    const contractAddress = contracts.ProjectRegistryV1 || contracts.ProjectRegistry

    if (!contractAddress) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    return new Contract(
        contractAddress,
        projectRegistryAbi,
        signer,
    ) as ProjectRegistryContract
}

export function getProjectRegistryChainId() {
    return getConfigForChainByName(getCoreConfig().projectsChain).id
}

export function getERC20TokenContract({
    tokenAddress,
    signer,
}: {
    tokenAddress: string
    signer?: Signer | providers.Provider
}) {
    return new Contract(tokenAddress, tokenAbi, signer) as TokenContract
}

export function getMarketplaceContract({
    chainId,
    signer,
}: {
    chainId: number
    signer?: Signer | providers.Provider
}) {
    return new Contract(
        getMarketplaceAddress(chainId),
        marketplaceAbi,
        signer,
    ) as MarketplaceContract
}

export async function getAllowance(
    chainId: number,
    tokenAddress: string,
    account: string,
    { recover = false }: { recover?: boolean } = {},
) {
    while (true) {
        try {
            return await getERC20TokenContract({
                tokenAddress,
                signer: getPublicWeb3Provider(chainId),
            }).allowance(account, getMarketplaceAddress(chainId))
        } catch (e) {
            console.warn('Allowance check failed', e)

            if (!recover) {
                throw e
            }

            try {
                await toaster(Toast, Layer.Toast).pop({
                    title: 'Allowance check failed',
                    type: ToastType.Warning,
                    desc: 'Would you like to try again?',
                    okLabel: 'Yes',
                    cancelLabel: 'No',
                })

                continue
            } catch (_) {
                throw e
            }
        }
    }
}

export async function getProjectPermissions(
    chainId: number,
    projectId: string,
    account: string,
) {
    if (account === address0) {
        return {
            canBuy: false,
            canDelete: false,
            canEdit: false,
            canGrant: false,
        }
    }

    const response = await getProjectRegistryContract({
        chainId,
        signer: getPublicWeb3Provider(chainId),
    }).getPermission(projectId, account)

    const [canBuy = false, canDelete = false, canEdit = false, canGrant = false] = z
        .array(z.boolean())
        .parse(response)

    return {
        canBuy,
        canDelete,
        canEdit,
        canGrant,
    }
}

export function getProjectTypeName(projectType: ProjectType) {
    switch (projectType) {
        case ProjectType.DataUnion:
            return 'Data Union'
        case ProjectType.OpenData:
            return 'open data project'
        case ProjectType.PaidData:
            return 'paid data project'
    }
}

export function getProjectTypeTitle(projectType: ProjectType) {
    switch (projectType) {
        case ProjectType.DataUnion:
            return 'Data Union'
        case ProjectType.OpenData:
            return 'Open Data'
        case ProjectType.PaidData:
            return 'Paid Data'
    }
}

export function getProjectImageUrl({
    imageUrl,
    imageIpfsCid,
}: {
    imageUrl?: string
    imageIpfsCid?: string
}) {
    const {
        ipfs: { ipfsGatewayUrl },
    } = getCoreConfig()

    if (imageIpfsCid) {
        return `${ipfsGatewayUrl}${imageIpfsCid}`
    }

    if (!imageUrl) {
        return
    }

    return `${imageUrl.replace(/^https:\/\/ipfs\.io\/ipfs\//, ipfsGatewayUrl)}`
}

export async function getFirstEnsNameFor(address: string) {
    const contract = new Contract(
        getCoreConfig().reverseRecordsAddress,
        reverseRecordsAbi,
        getPublicWeb3Provider(1),
    ) as ReverseRecordsContract

    const [domain] = await contract.getNames([address])

    return domain
}

export function getGraphProjectWithParsedMetadata<T extends { metadata: string }>(
    rawProject: T,
): Omit<T, 'metadata'> & {
    metadata: ProjectMetadata
} {
    let metadata: ProjectMetadata = {}

    try {
        metadata = ProjectMetadata.parse(JSON.parse(rawProject.metadata))
    } catch (e) {
        console.warn('Failed to parse project metadata', e)
    }

    return {
        ...rawProject,
        metadata,
    }
}

export async function getAllSponsorships({
    first,
    skip,
    streamId,
}: {
    first?: number
    skip?: number
    streamId?: string
}) {
    const {
        data: { sponsorships },
    } = await getGraphClient().query<
        GetAllSponsorshipsQuery,
        GetAllSponsorshipsQueryVariables
    >({
        query: GetAllSponsorshipsDocument,
        variables: {
            first,
            skip,
            streamContains: streamId,
        },
    })

    return sponsorships
}

export async function getSponsorshipById(sponsorshipId: string) {
    const {
        data: { sponsorship },
    } = await getGraphClient().query<
        GetSponsorshipByIdQuery,
        GetSponsorshipByIdQueryVariables
    >({
        query: GetSponsorshipByIdDocument,
        variables: {
            sponsorshipId,
        },
    })

    return sponsorship || null
}

export async function getSponsorshipsByCreator(
    creator: string,
    {
        first,
        skip,
        streamId,
    }: {
        first?: number
        skip?: number
        streamId?: string
    } = {},
) {
    const {
        data: { sponsorships },
    } = await getGraphClient().query<
        GetSponsorshipsByCreatorQuery,
        GetSponsorshipsByCreatorQueryVariables
    >({
        query: GetSponsorshipsByCreatorDocument,
        variables: {
            first,
            skip,
            streamContains: streamId,
            creator,
        },
    })

    return sponsorships
}
