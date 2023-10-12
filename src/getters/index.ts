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
import { address0 } from '~/consts'
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
    Operator,
    GetOperatorDailyBucketsQuery,
    GetOperatorDailyBucketsDocument,
    GetOperatorDailyBucketsQueryVariables,
    GetSponsorshipDailyBucketsQuery,
    GetSponsorshipDailyBucketsQueryVariables,
    GetSponsorshipDailyBucketsDocument,
    OrderDirection,
    Operator_OrderBy,
} from '~/generated/gql/network'
import getCoreConfig from '~/getters/getCoreConfig'
import getGraphClient from '~/getters/getGraphClient'
import { Delegation, ChartPeriod } from '~/types'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { BN, toBN } from '~/utils/bn'
import { isEthereumAddress } from '~/marketplace/utils/validate'

const DEFAULT_ORDER_BY = Operator_OrderBy.Id
const DEFAULT_ORDER_DIRECTION = OrderDirection.Asc

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
    orderBy = DEFAULT_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
}: {
    first?: number
    skip?: number
    orderBy?: GetAllOperatorsQueryVariables['orderBy']
    orderDirection?: OrderDirection
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
        },
    )

    return operators
}

export async function getOperatorsByDelegation({
    first,
    skip,
    address,
    orderBy = DEFAULT_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
}: {
    first?: number
    skip?: number
    address: string
    orderBy?: GetAllOperatorsQueryVariables['orderBy']
    orderDirection?: OrderDirection
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
    })

    return operators
}

export async function getOperatorsByDelegationAndId({
    first,
    skip,
    address,
    operatorId,
    orderBy = DEFAULT_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
}: {
    first?: number
    skip?: number
    address: string
    operatorId: string
    orderBy?: GetAllOperatorsQueryVariables['orderBy']
    orderDirection?: OrderDirection
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
    })

    return operators
}

export async function getOperatorsByDelegationAndMetadata({
    first,
    skip,
    address,
    searchQuery,
    orderBy = DEFAULT_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
}: {
    first?: number
    skip?: number
    address: string
    searchQuery: string
    orderBy?: GetAllOperatorsQueryVariables['orderBy']
    orderDirection?: OrderDirection
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
    })

    return operators
}

export async function searchOperatorsById({
    first,
    skip,
    operatorId,
    orderBy = DEFAULT_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
}: {
    first?: number
    skip?: number
    operatorId?: string
    orderBy?: GetAllOperatorsQueryVariables['orderBy']
    orderDirection?: OrderDirection
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
            orderBy,
            orderDirection,
        },
    })

    return operators
}

export async function searchOperatorsByMetadata({
    first,
    skip,
    searchQuery,
    orderBy = DEFAULT_ORDER_BY,
    orderDirection = DEFAULT_ORDER_DIRECTION,
}: {
    first?: number
    skip?: number
    searchQuery?: string
    orderBy?: GetAllOperatorsQueryVariables['orderBy']
    orderDirection?: OrderDirection
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
            orderBy,
            orderDirection,
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

/**
 * Fetches stream descriptions from the Graph.
 * @param streamId Stream ID
 * @returns A string
 */
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
 * Queries the Graph for a collection of wallet's delegations.
 * @param address Wallet address.
 * @param searchQuery Filter.
 * @param options.batchSize Number of entries to scout for.
 * @param options.skip Number of entries to skip.
 * @param options.onParseError Callback triggered for *each* parser failure (see `OperatorParser`).
 * @param options.onBeforeComplete Callback triggered just before returning the result. It carries
 * a total number of found operators and the number of successfully parsed operators.
 * @returns Collection of `Delegation` objects.
 */
export async function getDelegationsForWallet(
    address = '',
    searchQuery = '',
    {
        batchSize,
        skip,
        onParseError,
        onBeforeComplete,
    }: {
        batchSize?: number
        skip?: number
        onParseError?: (operator: Operator, error: unknown) => void
        onBeforeComplete?: (total: number, parsed: number) => void
    },
): Promise<Delegation[]> {
    const search = searchQuery.toLowerCase()

    return getParsedOperators(
        () => {
            const params = {
                first: batchSize,
                skip,
                address: address.toLowerCase(),
            }

            if (!search) {
                /**
                 * Empty search = look for all operators.
                 */
                return getOperatorsByDelegation(params) as Promise<Operator[]>
            }

            if (isEthereumAddress(search)) {
                /**
                 * Look for a delegation for a given operator id.
                 */
                return getOperatorsByDelegationAndId({
                    ...params,
                    operatorId: search,
                }) as Promise<Operator[]>
            }

            return getOperatorsByDelegationAndMetadata({
                ...params,
                searchQuery: search,
            }) as Promise<Operator[]>
        },
        {
            mapper(operator): Delegation {
                return {
                    ...operator,
                    apy: getSpotApy(operator),
                    myShare: getDelegatedAmountForWallet(address, operator),
                }
            },
            onParseError,
            onBeforeComplete,
        },
    )
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
        (sum, { spotAPY, projectedInsolvencyAt, amountWei, isSponsorshipRunning }) => {
            if (projectedInsolvencyAt * 1000 < now || !isSponsorshipRunning) {
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
 * Sums amounts delegated to given operator by given wallet.
 */
export function getDelegatedAmountForWallet(
    address: string,
    { delegators, exchangeRate }: ParsedOperator,
): BN {
    const addr = address.toLowerCase()

    return delegators
        .reduce(
            (sum, { delegator, operatorTokenBalanceWei }) =>
                delegator.toLowerCase() === addr
                    ? sum.plus(operatorTokenBalanceWei)
                    : sum,
            toBN(0),
        )
        .multipliedBy(exchangeRate)
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
    const total = operator.operatorTokenTotalSupplyWei
        .plus(offset)
        .multipliedBy(operator.exchangeRate)

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
    },
) {
    const {
        dateLowerThan: date_lt,
        dateGreaterEqualThan: date_gte,
        batchSize: first = 999,
        skip,
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
    },
) {
    const {
        dateLowerThan: date_lt,
        dateGreaterEqualThan: date_gte,
        batchSize: first = 999,
        skip,
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
    })

    return data.sponsorshipDailyBuckets
}
