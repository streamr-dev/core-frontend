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
import { getConfigForChain, getConfigForChainByName } from '~/shared/web3/config'
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
    GetOperatorByOwnerAddressQuery,
    GetOperatorByOwnerAddressQueryVariables,
    GetOperatorByOwnerAddressDocument,
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
} from '~/generated/gql/network'
import getCoreConfig from '~/getters/getCoreConfig'
import getGraphClient from '~/getters/getGraphClient'
import { ChartPeriod } from '~/types'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { BN, toBN } from '~/utils/bn'
import { errorToast } from '~/utils/toast'
import { SponsorshipParser } from '~/parsers/SponsorshipParser'
import {
    GetEnsDomainsForAccountDocument,
    GetEnsDomainsForAccountQuery,
    GetEnsDomainsForAccountQueryVariables,
} from '~/generated/gql/ens'
import { getCurrentChain } from '~/getters/getCurrentChain'

const DEFAULT_OPERATOR_ORDER_BY = Operator_OrderBy.Id
const DEFAULT_SPONSORSHIP_ORDER_BY = Sponsorship_OrderBy.Id
const DEFAULT_ORDER_DIRECTION = OrderDirection.Asc

export function getGraphUrl(): string {
    const currentChain = getCurrentChain()

    if (currentChain.theGraphUrl != null) {
        return currentChain.theGraphUrl
    }

    // Fall back to default subgraph name
    const { theGraphUrl } = getCoreConfig()
    const url = `${theGraphUrl}/subgraphs/name/streamr-dev/network-subgraphs`
    console.warn('There is no theGraphUrl in config. Falling back to', url)
    return url
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

export async function getAllSponsorships({
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
            searchQuery,
            id: searchQuery.toLowerCase(),
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return sponsorships
}

export async function getSponsorshipsByStreamId({
    first,
    skip,
    streamId = '',
    orderBy = DEFAULT_SPONSORSHIP_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    first?: number
    skip?: number
    streamId: string
    orderBy?: Sponsorship_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetSponsorshipByStreamIdQuery['sponsorships']> {
    const {
        data: { sponsorships },
    } = await getGraphClient().query<
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
    sponsorshipId: string,
    { force = false } = {},
) {
    let rawSponsorship: Sponsorship | undefined | null

    try {
        const { data } = await getGraphClient().query<
            GetSponsorshipByIdQuery,
            GetSponsorshipByIdQueryVariables
        >({
            query: GetSponsorshipByIdDocument,
            variables: {
                sponsorshipId: sponsorshipId.toLowerCase(),
            },
            fetchPolicy: force ? 'network-only' : void 0,
        })

        rawSponsorship = (data.sponsorship || null) as Sponsorship | null
    } catch (e) {
        console.warn('Failed to fetch a Sponsorship', e)

        errorToast({ title: 'Could not fetch Sponsorship details' })
    }

    if (!rawSponsorship) {
        return null
    }

    try {
        return SponsorshipParser.parseAsync(rawSponsorship)
    } catch (e) {
        console.warn('Failed to parse a Sponsorship', e)

        errorToast({ title: 'Could not parse Sponsorship details' })
    }

    return null
}

export async function getSponsorshipsByCreator(
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
    } = await getGraphClient().query<
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
    first,
    skip,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    first?: number
    skip?: number
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
}): Promise<GetAllOperatorsQuery['operators']> {
    const {
        data: { operators },
    } = await getGraphClient().query<GetAllOperatorsQuery, GetAllOperatorsQueryVariables>(
        {
            query: GetAllOperatorsDocument,
            variables: {
                first,
                skip,
                orderBy,
                orderDirection,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        },
    )

    return operators
}

export async function getOperatorsByDelegation({
    first,
    skip,
    address,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    first?: number
    skip?: number
    address: string
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
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
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function getOperatorsByDelegationAndId({
    first,
    skip,
    address,
    operatorId,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
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
    } = await getGraphClient().query<
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
    first,
    skip,
    address,
    searchQuery,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
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
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function searchOperatorsByMetadata({
    first,
    skip,
    searchQuery,
    orderBy = DEFAULT_OPERATOR_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
    force = false,
}: {
    first?: number
    skip?: number
    searchQuery?: string
    orderBy?: Operator_OrderBy
    orderDirection?: OrderDirection
    force?: boolean
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
            id: searchQuery?.toLowerCase() || '',
            orderBy,
            orderDirection,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return operators
}

export async function getOperatorById(
    operatorId: string,
    { force = false } = {},
): Promise<NonNullable<GetOperatorByIdQuery['operator']> | null> {
    const {
        data: { operator },
    } = await getGraphClient().query<GetOperatorByIdQuery, GetOperatorByIdQueryVariables>(
        {
            query: GetOperatorByIdDocument,
            variables: {
                operatorId,
            },
            fetchPolicy: force ? 'network-only' : void 0,
        },
    )

    return operator || null
}

export async function getParsedOperatorByOwnerAddress(
    address: string,
    { force = false }: { force?: boolean } = {},
): Promise<ParsedOperator | null> {
    const {
        data: { operators },
    } = await getGraphClient().query<
        GetOperatorByOwnerAddressQuery,
        GetOperatorByOwnerAddressQueryVariables
    >({
        query: GetOperatorByOwnerAddressDocument,
        variables: {
            owner: address.toLowerCase(),
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    const operator = operators?.[0] || null

    if (operator) {
        try {
            return OperatorParser.parse(operator)
        } catch (e) {
            if (!(e instanceof z.ZodError)) {
                throw e
            }

            console.warn('Failed to parse an operator', operator, e)
        }
    }

    return null
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
export async function getStreamDescription(streamId: string, { force = false } = {}) {
    const {
        data: { stream },
    } = await getGraphClient().query<GetStreamByIdQuery, GetStreamByIdQueryVariables>({
        query: GetStreamByIdDocument,
        variables: {
            streamId,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return z
        .object({
            metadata: z
                .string()
                .transform((v) => JSON.parse(v))
                .pipe(
                    z.object({
                        description: z
                            .string()
                            .optional()
                            .transform((v) => v || ''),
                    }),
                ),
        })
        .transform(({ metadata: { description } }) => description)
        .parse(stream)
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
    {
        mapper,
        onParseError,
        onBeforeComplete,
    }: {
        mapper?: Mapper
        onParseError?: (operator: Operator, error: unknown) => void
        onBeforeComplete?: (total: number, parsed: number) => void
    } = {},
): Promise<ReturnType<Mapper>[]> {
    const rawOperators = await getter()

    const operators: ReturnType<Mapper>[] = []

    const preparsedCount = rawOperators.length

    for (let i = 0; i < preparsedCount; i++) {
        const rawOperator = rawOperators[i]

        try {
            const operator = OperatorParser.parse(rawOperator)

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

    const { data } = await getGraphClient().query<
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
 * @param sponsorshipId Sponsorship ID
 * @param options.dateLowerThan End unix timestamp
 * @param options.dateGreaterEqualThan Start unix timestamp
 * @param options.batchSize Number of buckets to scout for at once
 * @param options.skip Number of buckets to skip
 * @returns Sponsorship buckets
 */
export async function getSponsorshipDailyBuckets(
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

    const { data } = await getGraphClient().query<
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

    const { data } = await getGraphClient().query<
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

    const { data = { domains: [] } } = await ensApolloClient.query<
        GetEnsDomainsForAccountQuery,
        GetEnsDomainsForAccountQueryVariables
    >({
        query: GetEnsDomainsForAccountDocument,
        variables: {
            account: wallet.toLowerCase(),
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    return (data.domains.map(({ name }) => name).filter(Boolean) as string[]).sort()
}
