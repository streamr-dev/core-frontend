import { BigNumber, Contract, Signer, providers } from 'ethers'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import {
    marketplaceV4ABI as marketplaceAbi,
    projectRegistryV1ABI as projectRegistryAbi,
    ProjectRegistryV1 as ProjectRegistryContract,
    MarketplaceV4 as MarketplaceContract,
} from '@streamr/hub-contracts'
import moment, { Moment } from 'moment'
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { Token as TokenContract } from '~/generated/types'
import { getMarketplaceAddress } from '~/marketplace/utils/web3'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { Layer } from '~/utils/Layer'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { ProjectType } from '~/shared/types'
import tokenAbi from '~/shared/web3/abis/token.json'
import { address0 } from '~/consts'
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
    GetOperatorsByOwnerOrControllerAddressQuery,
    GetOperatorsByOwnerOrControllerAddressQueryVariables,
    GetOperatorsByOwnerOrControllerAddressDocument,
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
    Operator,
    GetOperatorDailyBucketsQuery,
    GetOperatorDailyBucketsDocument,
    GetOperatorDailyBucketsQueryVariables,
    GetSponsorshipDailyBucketsQuery,
    GetSponsorshipDailyBucketsQueryVariables,
    GetSponsorshipDailyBucketsDocument,
    OrderDirection,
    Operator_OrderBy,
    Sponsorship_OrderBy,
    GetDelegatorDailyBucketsQuery,
    GetDelegatorDailyBucketsQueryVariables,
    GetDelegatorDailyBucketsDocument,
    Sponsorship,
    GetSponsorshipByStreamIdQuery,
    GetSponsorshipByStreamIdQueryVariables,
    GetSponsorshipByStreamIdDocument,
    GetNetworkStatsQuery,
    GetNetworkStatsQueryVariables,
    GetNetworkStatsDocument,
    GetOperatorByOwnerAddressQuery,
    GetOperatorByOwnerAddressQueryVariables,
    GetOperatorByOwnerAddressDocument,
    Sponsorship_Filter,
} from '~/generated/gql/network'
import { getGraphClient } from '~/getters/getGraphClient'
import { ChartPeriod } from '~/types'
import { ParsedOperator, parseOperator } from '~/parsers/OperatorParser'
import { BN, toBN } from '~/utils/bn'
import { errorToast } from '~/utils/toast'
import { parseSponsorship } from '~/parsers/SponsorshipParser'
import {
    GetEnsDomainsForAccountDocument,
    GetEnsDomainsForAccountQuery,
    GetEnsDomainsForAccountQueryVariables,
} from '~/generated/gql/ens'
import { prehandleBehindBlockError } from '~/errors/BehindIndexError'
import { getChainConfig, getChainConfigExtension } from '~/utils/chains'

const DEFAULT_OPERATOR_ORDER_BY = Operator_OrderBy.Id
const DEFAULT_SPONSORSHIP_ORDER_BY = Sponsorship_OrderBy.Id
const DEFAULT_ORDER_DIRECTION = OrderDirection.Asc

export function getProjectRegistryContract({
    chainId,
    provider,
}: {
    chainId: number
    provider?: Signer | providers.Provider
}) {
    const { contracts } = getChainConfig(chainId)

    const { ProjectRegistryV1: contractAddress } = contracts

    if (!contractAddress) {
        throw new Error(`No ProjectRegistry contract address found for chain ${chainId}`)
    }

    return new Contract(
        contractAddress,
        projectRegistryAbi,
        provider,
    ) as ProjectRegistryContract
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

export function getProjectImageUrl(
    chainId: number,
    {
        imageUrl,
        imageIpfsCid,
    }: {
        imageUrl?: string
        imageIpfsCid?: string
    },
): string | undefined {
    const { ipfsGatewayUrl } = getChainConfigExtension(chainId).ipfs

    if (imageIpfsCid) {
        return `${ipfsGatewayUrl}${imageIpfsCid}`
    }

    if (!imageUrl) {
        return
    }

    return `${imageUrl.replace(/^https:\/\/ipfs\.io\/ipfs\//, ipfsGatewayUrl)}`
}

export async function getAllSponsorships({
    chainId,
    first,
    skip,
    searchQuery = '',
    orderBy = DEFAULT_SPONSORSHIP_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
    includeInactive = true,
    includeWithoutFunding = true,
    includeExpiredFunding = true,
    hasOperatorId = undefined,
}: {
    chainId: number
    first?: number
    skip?: number
    searchQuery?: string
    orderBy?: Sponsorship_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
    includeInactive?: boolean
    includeWithoutFunding?: boolean
    includeExpiredFunding?: boolean
    hasOperatorId?: string
}): Promise<GetAllSponsorshipsQuery['sponsorships']> {
    const whereFilters: Sponsorship_Filter = {}

    if (!includeInactive) {
        whereFilters.isRunning = true
    }
    if (!includeWithoutFunding) {
        whereFilters.remainingWei_gt = 0
    }
    if (!includeExpiredFunding) {
        whereFilters.projectedInsolvency_gt = Math.floor(Date.now() / 1000)
    }
    if (hasOperatorId != null) {
        whereFilters.stakes_ = { operator_contains_nocase: hasOperatorId }
    }

    const {
        data: { sponsorships },
    } = await getGraphClient(chainId).query<
        GetAllSponsorshipsQuery,
        GetAllSponsorshipsQueryVariables
    >({
        query: GetAllSponsorshipsDocument,
        variables: {
            first,
            skip,
            searchQuery,
            id: searchQuery.toLowerCase(),
            orderBy,
            orderDirection,
            whereFilters,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return sponsorships
}

export async function getSponsorshipsByStreamId({
    chainId,
    first,
    skip,
    streamId = '',
    orderBy = DEFAULT_SPONSORSHIP_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    chainId: number
    first?: number
    skip?: number
    streamId: string
    orderBy?: Sponsorship_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetSponsorshipByStreamIdQuery['sponsorships']> {
    const {
        data: { sponsorships },
    } = await getGraphClient(chainId).query<
        GetSponsorshipByStreamIdQuery,
        GetSponsorshipByStreamIdQueryVariables
    >({
        query: GetSponsorshipByStreamIdDocument,
        variables: {
            first,
            skip,
            streamId,
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return sponsorships
}

export async function getParsedSponsorshipById(
    chainId: number,
    sponsorshipId: string,
    { force = false, minBlockNumber = 0 } = {},
) {
    let rawSponsorship: Sponsorship | undefined | null

    try {
        const { data } = await getGraphClient(chainId).query<
            GetSponsorshipByIdQuery,
            GetSponsorshipByIdQueryVariables
        >({
            query: GetSponsorshipByIdDocument,
            variables: {
                sponsorshipId: sponsorshipId.toLowerCase(),
                minBlockNumber,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        })

        rawSponsorship = (data.sponsorship || null) as Sponsorship | null
    } catch (e) {
        prehandleBehindBlockError(e, minBlockNumber)

        console.warn('Failed to fetch a Sponsorship', e)

        errorToast({ title: 'Could not fetch Sponsorship details' })
    }

    if (!rawSponsorship) {
        return null
    }

    try {
        return parseSponsorship(rawSponsorship, {
            chainId,
        })
    } catch (e) {
        console.warn('Failed to parse a Sponsorship', e)

        errorToast({ title: 'Could not parse Sponsorship details' })
    }

    return null
}

export async function getSponsorshipsByCreator(
    chainId: number,
    creator: string,
    {
        first,
        skip,
        searchQuery = '',
        orderBy = DEFAULT_SPONSORSHIP_ORDER_BY,
        orderDirection = DEFAULT_ORDER_DIRECTION,
        force = false,
    }: {
        first?: number
        skip?: number
        searchQuery?: string
        orderBy?: Sponsorship_OrderBy
        orderDirection?: OrderDirection
        force?: boolean
    } = {},
): Promise<GetSponsorshipsByCreatorQuery['sponsorships']> {
    const {
        data: { sponsorships },
    } = await getGraphClient(chainId).query<
        GetSponsorshipsByCreatorQuery,
        GetSponsorshipsByCreatorQueryVariables
    >({
        query: GetSponsorshipsByCreatorDocument,
        variables: {
            first,
            skip,
            searchQuery,
            id: searchQuery.toLowerCase(),
            creator,
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return sponsorships
}

export async function getAllOperators({
    chainId,
    first,
    skip,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    chainId: number
    first?: number
    skip?: number
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetAllOperatorsQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient(chainId).query<
        GetAllOperatorsQuery,
        GetAllOperatorsQueryVariables
    >({
        query: GetAllOperatorsDocument,
        variables: {
            first,
            skip,
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function getOperatorsByDelegation({
    chainId,
    first,
    skip,
    address,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    chainId: number
    first?: number
    skip?: number
    address: string
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetOperatorsByDelegationQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient(chainId).query<
        GetOperatorsByDelegationQuery,
        GetOperatorsByDelegationQueryVariables
    >({
        query: GetOperatorsByDelegationDocument,
        variables: {
            first,
            skip,
            delegator: address,
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function getOperatorsByDelegationAndId({
    chainId,
    first,
    skip,
    address,
    operatorId,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    chainId: number
    first?: number
    skip?: number
    address: string
    operatorId: string
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetOperatorsByDelegationAndIdQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient(chainId).query<
        GetOperatorsByDelegationAndIdQuery,
        GetOperatorsByDelegationAndIdQueryVariables
    >({
        query: GetOperatorsByDelegationAndIdDocument,
        variables: {
            first,
            skip,
            delegator: address,
            operatorId,
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function getOperatorsByDelegationAndMetadata({
    chainId,
    first,
    skip,
    address,
    searchQuery,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    chainId: number
    first?: number
    skip?: number
    address: string
    searchQuery: string
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetOperatorsByDelegationAndMetadataQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient(chainId).query<
        GetOperatorsByDelegationAndMetadataQuery,
        GetOperatorsByDelegationAndMetadataQueryVariables
    >({
        query: GetOperatorsByDelegationAndMetadataDocument,
        variables: {
            first,
            skip,
            delegator: address,
            searchQuery,
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function searchOperatorsByMetadata({
    chainId,
    first,
    skip,
    searchQuery,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    chainId: number
    first?: number
    skip?: number
    searchQuery?: string
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<SearchOperatorsByMetadataQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient(chainId).query<
        SearchOperatorsByMetadataQuery,
        SearchOperatorsByMetadataQueryVariables
    >({
        query: SearchOperatorsByMetadataDocument,
        variables: {
            first,
            skip,
            searchQuery,
            id: searchQuery?.toLowerCase() || '',
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function getOperatorById(
    chainId: number,
    operatorId: string,
    { force = false, minBlockNumber = 0 } = {},
): Promise<NonNullable<GetOperatorByIdQuery['operator']> | null> {
    try {
        const {
            data: { operator },
        } = await getGraphClient(chainId).query<
            GetOperatorByIdQuery,
            GetOperatorByIdQueryVariables
        >({
            query: GetOperatorByIdDocument,
            variables: {
                operatorId,
                minBlockNumber,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        })

        return operator || null
    } catch (e) {
        prehandleBehindBlockError(e, minBlockNumber)

        throw e
    }
}

export async function getParsedOperatorByOwnerAddress(
    chainId: number,
    address: string,
    { force = false, minBlockNumber = 0 } = {},
): Promise<ParsedOperator | null> {
    let operator: GetOperatorByOwnerAddressQuery['operators'][0] | null = null

    try {
        const {
            data: { operators },
        } = await getGraphClient(chainId).query<
            GetOperatorByOwnerAddressQuery,
            GetOperatorByOwnerAddressQueryVariables
        >({
            query: GetOperatorByOwnerAddressDocument,
            variables: {
                owner: address.toLowerCase(),
                minBlockNumber,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        })

        operator = operators?.[0] || null
    } catch (e) {
        prehandleBehindBlockError(e, minBlockNumber)

        throw e
    }

    if (operator) {
        try {
            return parseOperator(operator, { chainId })
        } catch (e) {
            if (!(e instanceof z.ZodError)) {
                throw e
            }

            console.warn('Failed to parse an operator', operator, e)
        }
    }

    return null
}

export async function getParsedOperatorsByOwnerOrControllerAddress(
    chainId: number,
    address: string,
    { force = false, minBlockNumber = 0 } = {},
): Promise<ParsedOperator[]> {
    let queryResult: GetOperatorsByOwnerOrControllerAddressQuery['operators'] = []

    try {
        const {
            data: { operators },
        } = await getGraphClient(chainId).query<
            GetOperatorsByOwnerOrControllerAddressQuery,
            GetOperatorsByOwnerOrControllerAddressQueryVariables
        >({
            query: GetOperatorsByOwnerOrControllerAddressDocument,
            variables: {
                owner: address.toLowerCase(),
                minBlockNumber,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        })

        queryResult = operators
    } catch (e) {
        prehandleBehindBlockError(e, minBlockNumber)

        throw e
    }

    const result: ParsedOperator[] = []
    queryResult.map((operator) => {
        try {
            const parsedOperator = parseOperator(operator, { chainId })
            result.push(parsedOperator)
        } catch (e) {
            if (!(e instanceof z.ZodError)) {
                throw e
            }

            console.warn('Failed to parse an operator', operator, e)
        }
    })

    return result
}

export async function getBase64ForFile<T extends File>(file: T): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => void resolve(reader.result as string)

        reader.onerror = reject
    })
}

/**
 * Fetches stream descriptions from the Graph.
 * @param streamId Stream ID
 * @returns A string
 */
export async function getStreamDescription(
    chainId: number,
    streamId: string,
    { force = false } = {},
) {
    const {
        data: { stream },
    } = await getGraphClient(chainId).query<
        GetStreamByIdQuery,
        GetStreamByIdQueryVariables
    >({
        query: GetStreamByIdDocument,
        variables: {
            streamId,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return stream ? getDescription(stream) : ''
}

interface GetParsedOperatorsOptions<Mapper> {
    chainId: number
    mapper?: Mapper
    onParseError?: (operator: Operator, error: unknown) => void
    onBeforeComplete?: (total: number, parsed: number) => void
}

/**
 * Gets a collection of parsed Operators.
 * @param getter Callback that "gets" raw Operator objects.
 * @param options.mapper A mapping function that translates `ParsedOperator` instances into
 * something different.
 * @param options.onParseError Callback triggered for *each* parser failure (see `OperatorParser`).
 * @param options.onBeforeComplete Callback triggered just before returning the result. It carries
 * a total number of found operators and the number of successfully parsed operators.
 */
export async function getParsedOperators<
    Mapper extends (operator: ParsedOperator) => any = (
        operator: ParsedOperator,
    ) => ParsedOperator,
>(
    getter: () => Operator[] | Promise<Operator[]>,
    options: GetParsedOperatorsOptions<Mapper>,
): Promise<ReturnType<Mapper>[]> {
    const { chainId, mapper, onParseError, onBeforeComplete } = options

    const rawOperators = await getter()

    const operators: ReturnType<Mapper>[] = []

    const preparsedCount = rawOperators.length

    for (let i = 0; i < preparsedCount; i++) {
        const rawOperator = rawOperators[i]

        try {
            const operator = parseOperator(rawOperator, { chainId })

            operators.push(mapper ? mapper(operator) : operator)
        } catch (e) {
            onParseError
                ? onParseError(rawOperator as Operator, e)
                : console.warn('Failed to parse an operator', rawOperator, e)
        }
    }

    onBeforeComplete?.(preparsedCount, operators.length)

    return operators
}

/**
 * Compute projected yearly earnings based on the current yield.
 * @param operator.valueWithoutEarnings Total value of the pool.
 * @param operator.stakes Collection of basic stake information (amount, spot apy, projected insolvency date).
 * @returns Number representing the APY factor (0.01 is 1%).
 */
export function getSpotApy<
    T extends Pick<ParsedOperator, 'valueWithoutEarnings' | 'stakes'>,
>({ valueWithoutEarnings, stakes }: T): number {
    if (valueWithoutEarnings.isEqualTo(0)) {
        return 0
    }

    const now = Date.now()

    const yearlyIncome = stakes.reduce(
        (sum, { spotAPY, projectedInsolvencyAt, amountWei, isSponsorshipPaying }) => {
            if (
                projectedInsolvencyAt == null ||
                projectedInsolvencyAt * 1000 < now ||
                !isSponsorshipPaying
            ) {
                /**
                 * Skip expired stakes.
                 */
                return sum
            }

            return sum.plus(amountWei.multipliedBy(spotAPY))
        },
        toBN(0),
    )

    if (yearlyIncome.isEqualTo(0)) {
        return 0
    }

    return yearlyIncome.dividedBy(valueWithoutEarnings).toNumber()
}

/**
 * Calculates the amount delegated to given operator by given wallet.
 */
export function getDelegatedAmountForWallet(
    address: string,
    { delegations }: ParsedOperator,
): BN {
    const addr = address.toLowerCase()

    return (
        delegations.find(({ delegator }) => delegator.toLowerCase() === addr)?.amount ||
        toBN(0)
    )
}

/**
 * Sums amounts delegated to given operator by its owner.
 */
export function getSelfDelegatedAmount(operator: ParsedOperator) {
    return getDelegatedAmountForWallet(operator.owner, operator)
}

/**
 * Calculates wallet's delegation's ratio out of the total optionally
 * modded with `offset`.
 */
export function getDelegationFractionForWallet(
    address: string,
    operator: ParsedOperator,
    { offset = toBN(0) }: { offset?: BN } = {},
) {
    const total = operator.valueWithoutEarnings.plus(offset)

    if (total.isEqualTo(0)) {
        return toBN(0)
    }

    return getDelegatedAmountForWallet(address, operator).dividedBy(total)
}

/**
 * Calculates the amount of DATA needed to payout undelegation queue in full.
 */
export function calculateUndelegationQueueSize(operator: ParsedOperator): BN {
    const lookup: Record<string, BN> = {}

    // Sum up queue by addresses
    for (let i = 0; i < operator.queueEntries.length; i++) {
        const element = operator.queueEntries[i]

        if (lookup[element.delegator] == null) {
            lookup[element.delegator] = toBN(0)
        }

        lookup[element.delegator] = lookup[element.delegator].plus(element.amount)
    }

    // Go through addresses and make sure we cap to max delegation
    for (const address of Object.keys(lookup)) {
        lookup[address] = BN.min(
            lookup[address],
            getDelegatedAmountForWallet(address, operator),
        )
    }

    // Return total sum of all addresses
    return Object.values(lookup).reduce((a, b) => a.plus(b), toBN(0))
}

/**
 * Calculates owner's own delegation's ratio out of the total optionally
 * modded with `offset`.
 */
export function getSelfDelegationFraction(
    operator: ParsedOperator,
    { offset = toBN(0) }: { offset?: BN } = {},
) {
    return getDelegationFractionForWallet(operator.owner, operator, { offset })
}

/**
 * Turns `period` into a timestamp relative to `end` moment.
 */
export function getTimestampForChartPeriod(period: ChartPeriod, end: Moment): Moment {
    const result = (() => {
        switch (period) {
            case ChartPeriod.SevenDays:
                return end.clone().subtract(7, 'days')
            case ChartPeriod.OneMonth:
                return end.clone().subtract(30, 'days')
            case ChartPeriod.ThreeMonths:
                return end.clone().subtract(90, 'days')
            case ChartPeriod.OneYear:
                return end.clone().subtract(365, 'days')
            case ChartPeriod.YearToDate:
                return end.clone().startOf('year')
            case ChartPeriod.All:
            default:
                return moment(0).utc()
        }
    })()

    return result
}

function parseNetworkStats(stats: GetNetworkStatsQuery) {
    try {
        return z
            .object({
                totalStake: z.string().transform(toBN),
                sponsorshipsCount: z.number(),
                operatorsCount: z.number(),
            })
            .parse(stats.networks[0])
    } catch (e) {
        return undefined
    }
}

export async function getNetworkStats(chainId: number) {
    const { data } = await getGraphClient(chainId).query<
        GetNetworkStatsQuery,
        GetNetworkStatsQueryVariables
    >({
        query: GetNetworkStatsDocument,
    })

    return parseNetworkStats(data)
}

/**
 * Fetches a collection of daily Operator buckets.
 * @param operatorId Operator ID
 * @param options.dateLowerThan End unix timestamp
 * @param options.dateGreaterEqualThan Start unix timestamp
 * @param options.batchSize Number of buckets to scout for at once
 * @param options.skip Number of buckets to skip
 * @returns Operator buckets
 */
export async function getOperatorDailyBuckets(
    chainId: number,
    operatorId: string,
    options: {
        dateLowerThan: number
        dateGreaterEqualThan: number
        batchSize?: number
        skip?: number
        force?: boolean
    },
) {
    const {
        dateLowerThan: date_lt,
        dateGreaterEqualThan: date_gte,
        batchSize: first = 999,
        skip,
        force = false,
    } = options

    const { data } = await getGraphClient(chainId).query<
        GetOperatorDailyBucketsQuery,
        GetOperatorDailyBucketsQueryVariables
    >({
        query: GetOperatorDailyBucketsDocument,
        variables: {
            first,
            skip,
            where: {
                operator_: {
                    id: operatorId,
                },
                date_lt,
                date_gte,
            },
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return data.operatorDailyBuckets
}

/**
 * Fetches a collection of daily Sponsorship buckets.
 * @param chainId Chain ID
 * @param sponsorshipId Sponsorship ID
 * @param options.dateLowerThan End unix timestamp
 * @param options.dateGreaterEqualThan Start unix timestamp
 * @param options.batchSize Number of buckets to scout for at once
 * @param options.skip Number of buckets to skip
 * @returns Sponsorship buckets
 */
export async function getSponsorshipDailyBuckets(
    chainId: number,
    sponsorshipId: string,
    options: {
        dateLowerThan: number
        dateGreaterEqualThan: number
        batchSize?: number
        skip?: number
        force?: boolean
    },
) {
    const {
        dateLowerThan: date_lt,
        dateGreaterEqualThan: date_gte,
        batchSize: first = 999,
        skip,
        force = false,
    } = options

    const { data } = await getGraphClient(chainId).query<
        GetSponsorshipDailyBucketsQuery,
        GetSponsorshipDailyBucketsQueryVariables
    >({
        query: GetSponsorshipDailyBucketsDocument,
        variables: {
            first,
            skip,
            where: {
                sponsorship_: {
                    id: sponsorshipId,
                },
                date_lt,
                date_gte,
            },
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return data.sponsorshipDailyBuckets
}

/**
 * Fetches a collection of daily Delegator buckets.
 * @param delegatorId Delegator ID
 * @param options.dateLowerThan End unix timestamp
 * @param options.dateGreaterEqualThan Start unix timestamp
 * @param options.batchSize Number of buckets to scout for at once
 * @param options.skip Number of buckets to skip
 * @returns Delegator buckets
 */
export const getDelegatorDailyBuckets = async (
    chainId: number,
    delegatorId: string,
    options: {
        dateLowerThan: number
        dateGreaterEqualThan: number
        batchSize?: number
        skip?: number
        force?: boolean
    },
): Promise<GetDelegatorDailyBucketsQuery['delegatorDailyBuckets']> => {
    const {
        dateLowerThan: date_lt,
        dateGreaterEqualThan: date_gte,
        batchSize: first = 999,
        skip,
        force = false,
    } = options

    const { data } = await getGraphClient(chainId).query<
        GetDelegatorDailyBucketsQuery,
        GetDelegatorDailyBucketsQueryVariables
    >({
        query: GetDelegatorDailyBucketsDocument,
        variables: {
            first,
            skip,
            where: {
                delegator: delegatorId,
                date_lt,
                date_gte,
            },
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return data.delegatorDailyBuckets
}

let ensApolloClient: ApolloClient<NormalizedCacheObject> | undefined

/**
 * Fetches the ENS subgraph for domains associated with the given `wallet` address.
 */
export async function getENSDomainsForWallet(
    wallet: string | undefined,
    { force = false } = {},
): Promise<string[]> {
    if (!wallet) {
        return []
    }

    if (!ensApolloClient) {
        ensApolloClient = new ApolloClient({
            uri:
                process.env.ENS_GRAPH_SCHEMA_PATH ||
                'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
            cache: new InMemoryCache(),
        })
    }

    const { data = { domains: [], wrappedDomains: [] } } = await ensApolloClient.query<
        GetEnsDomainsForAccountQuery,
        GetEnsDomainsForAccountQueryVariables
    >({
        query: GetEnsDomainsForAccountDocument,
        variables: {
            account: wallet.toLowerCase(),
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return [...data.domains, ...data.wrappedDomains]
        .map(({ name }) => (!!name && /\.eth$/.test(name) ? name : null))
        .sort()
        .filter(Boolean) as string[]
}

const blockExplorerUrls = Object.freeze({
    100: 'https:/gnosisscan.io',
    137: 'https://polygonscan.com',
    80002: 'https://amoy.polygonscan.com',
})

/**
 * Returns a block explorer URL for a given chain id.
 */
export function getBlockExplorerUrl(chainId: number): string | undefined {
    return blockExplorerUrls[chainId] || undefined
}

/**
 * Extracts description from a metadata-having Stream-alike
 */
export function getDescription(streamalike: { metadata: string }) {
    try {
        return z
            .string()
            .transform((v) => JSON.parse(v))
            .pipe(
                z.object({
                    description: z
                        .string()
                        .optional()
                        .transform((v) => v || ''),
                }),
            )
            .parse(streamalike.metadata).description
    } catch (e) {
        return ''
    }
}
