import { BigNumber, Contract, Signer, providers } from 'ethers'
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
    GetAllOperatorsQuery,
    GetAllOperatorsQueryVariables,
    GetAllOperatorsDocument,
    GetOperatorByIdQuery,
    GetOperatorByIdQueryVariables,
    GetOperatorByIdDocument,
    GetOperatorsByDelegationQuery,
    GetOperatorsByDelegationQueryVariables,
    GetOperatorsByDelegationDocument,
    GetOperatorByOwnerAddressQuery,
    GetOperatorByOwnerAddressQueryVariables,
    GetOperatorByOwnerAddressDocument,
    SearchOperatorsByIdQuery,
    SearchOperatorsByIdQueryVariables,
    SearchOperatorsByIdDocument,
    SearchOperatorsByMetadataQuery,
    SearchOperatorsByMetadataQueryVariables,
    SearchOperatorsByMetadataDocument,
    GetOperatorsByDelegationAndIdQuery,
    GetOperatorsByDelegationAndIdDocument,
    GetOperatorsByDelegationAndIdQueryVariables,
    GetOperatorsByDelegationAndMetadataQuery,
    GetOperatorsByDelegationAndMetadataQueryVariables,
    GetOperatorsByDelegationAndMetadataDocument,
    GetStreamByIdQuery,
    GetStreamByIdQueryVariables,
    GetStreamByIdDocument,
} from '~/generated/gql/network'
import getCoreConfig from './getCoreConfig'
import getGraphClient from './getGraphClient'

export function getGraphUrl(): string {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()

    return `${theGraphUrl}/subgraphs/name/${theHubGraphName}`
}

export function getProjectRegistryContract({
    chainId,
    provider,
}: {
    chainId: number
    provider?: Signer | providers.Provider
}) {
    const { contracts } = getConfigForChain(chainId)

    const contractAddress = contracts.ProjectRegistryV1 || contracts.ProjectRegistry

    if (!contractAddress) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    return new Contract(
        contractAddress,
        projectRegistryAbi,
        provider,
    ) as ProjectRegistryContract
}

export function getProjectRegistryChainId(): number {
    return getConfigForChainByName(getCoreConfig().projectsChain).id
}

export function getERC20TokenContract({
    tokenAddress,
    provider,
}: {
    tokenAddress: string
    provider?: Signer | providers.Provider
}) {
    return new Contract(tokenAddress, tokenAbi, provider) as TokenContract
}

export function getMarketplaceContract({
    chainId,
    provider,
}: {
    chainId: number
    provider?: Signer | providers.Provider
}) {
    return new Contract(
        getMarketplaceAddress(chainId),
        marketplaceAbi,
        provider,
    ) as MarketplaceContract
}

export async function getAllowance(
    chainId: number,
    tokenAddress: string,
    account: string,
    { recover = false }: { recover?: boolean } = {},
): Promise<BigNumber> {
    while (true) {
        try {
            return await getERC20TokenContract({
                tokenAddress,
                provider: getPublicWeb3Provider(chainId),
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
): Promise<{
    canBuy: boolean
    canDelete: boolean
    canEdit: boolean
    canGrant: boolean
}> {
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
        provider: getPublicWeb3Provider(chainId),
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

export function getProjectTypeName(projectType: ProjectType): string {
    switch (projectType) {
        case ProjectType.DataUnion:
            return 'Data Union'
        case ProjectType.OpenData:
            return 'open data project'
        case ProjectType.PaidData:
            return 'paid data project'
    }
}

export function getProjectTypeTitle(projectType: ProjectType): string {
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
}): string | undefined {
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

export async function getFirstEnsNameFor(address: string): Promise<string> {
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
    streamId = '',
}: {
    first?: number
    skip?: number
    streamId?: string
}): Promise<GetAllSponsorshipsQuery['sponsorships']> {
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

export async function getSponsorshipById(
    sponsorshipId: string,
): Promise<NonNullable<GetSponsorshipByIdQuery['sponsorship']> | null> {
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
        streamId = '',
    }: {
        first?: number
        skip?: number
        streamId?: string
    } = {},
): Promise<GetSponsorshipsByCreatorQuery['sponsorships']> {
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

export async function getAllOperators({
    first,
    skip,
}: {
    first?: number
    skip?: number
}): Promise<GetAllOperatorsQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<GetAllOperatorsQuery, GetAllOperatorsQueryVariables>(
        {
            query: GetAllOperatorsDocument,
            variables: {
                first,
                skip,
            },
        },
    )

    return operators
}

export async function getOperatorsByDelegation({
    first,
    skip,
    address,
}: {
    first?: number
    skip?: number
    address: string
}): Promise<GetOperatorsByDelegationQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        GetOperatorsByDelegationQuery,
        GetOperatorsByDelegationQueryVariables
    >({
        query: GetOperatorsByDelegationDocument,
        variables: {
            first,
            skip,
            delegator: address,
        },
    })

    return operators
}

export async function getOperatorsByDelegationAndId({
    first,
    skip,
    address,
    id,
}: {
    first?: number
    skip?: number
    address: string
    id: string
}): Promise<GetOperatorsByDelegationAndIdQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        GetOperatorsByDelegationAndIdQuery,
        GetOperatorsByDelegationAndIdQueryVariables
    >({
        query: GetOperatorsByDelegationAndIdDocument,
        variables: {
            first,
            skip,
            delegator: address,
            operatorId: id,
        },
    })

    return operators
}

export async function getOperatorsByDelegationAndMetadata({
    first,
    skip,
    address,
    searchQuery,
}: {
    first?: number
    skip?: number
    address: string
    searchQuery: string
}): Promise<GetOperatorsByDelegationAndMetadataQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        GetOperatorsByDelegationAndMetadataQuery,
        GetOperatorsByDelegationAndMetadataQueryVariables
    >({
        query: GetOperatorsByDelegationAndMetadataDocument,
        variables: {
            first,
            skip,
            delegator: address,
            searchQuery,
        },
    })

    return operators
}

export async function searchOperatorsById({
    first,
    skip,
    operatorId,
}: {
    first?: number
    skip?: number
    operatorId?: string
}): Promise<SearchOperatorsByIdQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        SearchOperatorsByIdQuery,
        SearchOperatorsByIdQueryVariables
    >({
        query: SearchOperatorsByIdDocument,
        variables: {
            first,
            skip,
            operatorId,
        },
    })

    return operators
}

export async function searchOperatorsByMetadata({
    first,
    skip,
    searchQuery,
}: {
    first?: number
    skip?: number
    searchQuery?: string
}): Promise<SearchOperatorsByMetadataQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        SearchOperatorsByMetadataQuery,
        SearchOperatorsByMetadataQueryVariables
    >({
        query: SearchOperatorsByMetadataDocument,
        variables: {
            first,
            skip,
            searchQuery,
        },
    })

    return operators
}

export async function getOperatorById(
    operatorId: string,
): Promise<NonNullable<GetOperatorByIdQuery['operator']> | null> {
    const {
        data: { operator },
    } = await getGraphClient().query<GetOperatorByIdQuery, GetOperatorByIdQueryVariables>(
        {
            query: GetOperatorByIdDocument,
            variables: {
                operatorId,
            },
        },
    )

    return operator || null
}

export async function getOperatorByOwnerAddress(
    address: string,
): Promise<NonNullable<GetOperatorByOwnerAddressQuery['operators'][0]> | null> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        GetOperatorByOwnerAddressQuery,
        GetOperatorByOwnerAddressQueryVariables
    >({
        query: GetOperatorByOwnerAddressDocument,
        variables: {
            owner: address,
        },
    })

    return operators?.length ? operators[0] : null
}

export async function getBase64ForFile<T extends File>(file: T): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => void resolve(reader.result as string)

        reader.onerror = reject
    })
}

export async function getStreamDescription(streamId: string) {
    const {
        data: { stream },
    } = await getGraphClient().query<GetStreamByIdQuery, GetStreamByIdQueryVariables>({
        query: GetStreamByIdDocument,
        variables: {
            streamId,
        },
    })

    return z
        .object({
            metadata: z
                .string()
                .transform((v) => JSON.parse(v))
                .pipe(
                    z.object({
                        description: z.string(),
                    }),
                ),
        })
        .transform(({ metadata: { description } }) => description)
        .parse(stream)
}
