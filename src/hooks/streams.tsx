import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { address0 } from '~/consts'
import {
    Stream_Filter,
    Stream_OrderBy,
    OrderDirection as GraphOrderDirection,
    GetPagedStreamsQuery,
    GetPagedStreamsQueryVariables,
    GetPagedStreamsDocument,
    StreamPermission,
} from '~/generated/gql/network'
import { getGraphClient, getIndexerClient } from '~/getters/getGraphClient'
import { useWalletAccount } from '~/shared/stores/wallet'
import { OrderDirection } from '~/types'
import {
    GetStreamsDocument as GetIndexerStreamsDocument,
    GetStreamsQuery as GetIndexerStreamsQuery,
    GetStreamsQueryVariables as GetIndexerStreamsQueryVariables,
    OrderDirection as IndexerOrderDirection,
    OrderBy as IndexerOrderBy,
    GetGlobalStreamsStatsQuery,
    GetGlobalStreamsStatsQueryVariables,
    GetGlobalStreamsStatsDocument,
} from '~/generated/gql/indexer'
import { getDescription } from '~/getters'
import { useCurrentChainId } from '~/shared/stores/chain'

export enum StreamsTabOption {
    All = 'all',
    Your = 'your',
}

export function isStreamsTabOption(value: unknown): value is StreamsTabOption {
    return value === StreamsTabOption.All || value === StreamsTabOption.Your
}

export type StreamsOrderBy = 'id' | 'mps' | 'peerCount'

export interface UseStreamsQueryOptions {
    onBatch?: ({
        streamIds,
        source,
    }: {
        streamIds: string[]
        source: 'graph' | 'indexer'
    }) => void
    orderBy: StreamsOrderBy
    orderDirection: OrderDirection
    pageSize?: number
    search?: string
    streamIds?: string[]
    tab?: StreamsTabOption
}

interface GetStreamsOptions {
    pageParam?: string
    force?: boolean
    orderBy?: StreamsOrderBy
    orderDirection?: OrderDirection
    owner?: string
    pageSize?: number
    search?: string
    streamIds?: string[]
}

export interface GetStreamsResult {
    hasNextPage: boolean
    nextPageParam: string | null
    streams: {
        description: string
        id: string
        messagesPerSecond: number | undefined
        peerCount: number | undefined
        publisherCount: number | undefined
        source: 'indexer' | 'graph'
        subscriberCount: number | undefined
    }[]
}

async function getStreamsFromIndexer(
    chainId: number,
    options: GetStreamsOptions = {},
): Promise<GetStreamsResult> {
    const {
        force = false,
        orderBy,
        orderDirection,
        owner,
        pageParam: cursor,
        pageSize,
        search,
        streamIds,
    } = options

    const {
        data: { streams: result },
    } = await getIndexerClient(chainId).query<
        GetIndexerStreamsQuery,
        GetIndexerStreamsQueryVariables
    >({
        fetchPolicy: force ? 'network-only' : undefined,
        query: GetIndexerStreamsDocument,
        variables: {
            streamIds,
            first: pageSize,
            orderBy:
                orderBy === 'mps'
                    ? IndexerOrderBy.MessagesPerSecond
                    : orderBy === 'peerCount'
                    ? IndexerOrderBy.PeerCount
                    : undefined,
            orderDirection:
                orderDirection === 'asc'
                    ? IndexerOrderDirection.Asc
                    : orderDirection === 'desc'
                    ? IndexerOrderDirection.Desc
                    : undefined,
            search,
            owner,
            cursor,
        },
    })

    const streams = result.items.map(({ id, messagesPerSecond, peerCount, ...s }) => ({
        description: s.description || '',
        id,
        messagesPerSecond,
        peerCount,
        publisherCount: s.publisherCount || undefined,
        source: 'graph' as const,
        subscriberCount: s.subscriberCount || undefined,
    }))

    return {
        hasNextPage: result.cursor != null,
        nextPageParam: result.cursor || null,
        streams,
    }
}

async function getStreamsFromGraph(
    chainId: number,
    options: GetStreamsOptions = {},
): Promise<GetStreamsResult> {
    const {
        force = false,
        orderBy,
        orderDirection: orderDirectionParam,
        owner,
        pageParam: lastId,
        pageSize = 10,
        search,
        streamIds,
    } = options

    const orderOperator = orderDirectionParam === 'asc' ? 'gt' : 'lt'

    const orderDirection =
        orderDirectionParam === 'asc'
            ? GraphOrderDirection.Asc
            : orderDirectionParam === 'desc'
            ? GraphOrderDirection.Desc
            : undefined

    const where: Stream_Filter = {
        permissions_: {
            stream_contains_nocase: search,
            userAddress: owner,
        },
        [`id_${orderOperator}`]: lastId,
        id_in: streamIds,
    }

    if (!where.permissions_?.stream_contains_nocase) {
        delete where.permissions_?.stream_contains_nocase
    }

    if (!where.permissions_?.userAddress) {
        delete where.permissions_?.userAddress
    }

    if (Object.keys(where.permissions_ || {}).length === 0) {
        delete where.permissions_
    }

    if (where[`id_${orderOperator}`] == null) {
        delete where[`id_${orderOperator}`]
    }

    if (!where.id_in) {
        delete where.id_in
    }

    const {
        data: { streams: result },
    } = await getGraphClient(chainId).query<
        GetPagedStreamsQuery,
        GetPagedStreamsQueryVariables
    >({
        query: GetPagedStreamsDocument,
        variables: {
            first: pageSize + 1,
            orderBy: orderBy === 'id' ? Stream_OrderBy.Id : undefined,
            orderDirection,
            where,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    const streams = result.map((s) => {
        const { publisherCount, subscriberCount } = getStatsFromPermissions(
            s.permissions || [],
        )

        return {
            description: getDescription(s),
            id: s.id,
            messagesPerSecond: undefined,
            peerCount: undefined,
            publisherCount,
            source: 'indexer' as const,
            subscriberCount,
        }
    })

    return {
        streams,
        hasNextPage: streams.length > pageSize,
        nextPageParam: streams[streams.length - 1].id,
    }
}

export function useStreamsQuery(options: UseStreamsQueryOptions) {
    const {
        onBatch,
        orderBy,
        orderDirection,
        pageSize = 10,
        search,
        tab,
        streamIds,
    } = options

    const account = useWalletAccount()

    const chainId = useCurrentChainId()

    return useInfiniteQuery<GetStreamsResult>({
        queryKey: [
            'useStreamsQuery',
            chainId,
            account,
            orderBy,
            orderDirection,
            pageSize,
            search,
            tab,
            ...(streamIds || []),
        ],
        queryFn: async ({ pageParam }) => {
            const owner = tab === StreamsTabOption.Your ? account || address0 : undefined

            const getter = isIndexerColumn(orderBy)
                ? getStreamsFromIndexer
                : getStreamsFromGraph

            const { streams, nextPageParam, hasNextPage } = await getter(chainId, {
                force: true,
                orderBy,
                orderDirection,
                owner: owner?.toLowerCase(),
                pageParam,
                pageSize,
                search: search?.toLowerCase() || undefined,
                streamIds,
            })

            onBatch?.({
                streamIds: streams.map((s) => s.id),
                source: isIndexerColumn(orderBy) ? 'indexer' : 'graph',
            })

            return {
                hasNextPage,
                nextPageParam,
                streams,
            }
        },
        getNextPageParam: ({ hasNextPage, nextPageParam }) =>
            hasNextPage ? nextPageParam : null,
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

export function isIndexerColumn(orderBy: StreamsOrderBy) {
    return orderBy === 'mps' || orderBy === 'peerCount'
}

export function useStreamsStatsQuery() {
    const chainId = useCurrentChainId()

    return useInfiniteQuery({
        queryKey: ['useStreamsStatsQuery', chainId],
        queryFn: async ({ pageParam }) => {
            if (pageParam == null) {
                return
            }

            const { useIndexer, streamIds } = pageParam

            const getter = useIndexer ? getStreamsFromIndexer : getStreamsFromGraph

            return await getter(chainId, {
                force: true,
                pageSize: streamIds.length,
                streamIds,
            })
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })
}

interface GetStatsFromPermissionsResult {
    subscriberCount: number | undefined
    publisherCount: number | undefined
}

function getStatsFromPermissions(
    permissions: StreamPermission[],
): GetStatsFromPermissionsResult {
    let subscriberCount: number | undefined = 0

    let publisherCount: number | undefined = 0

    permissions.forEach((perm) => {
        if (perm.userAddress === address0) {
            /**
             * If stream has public permissions (zero address), return `undefined`
             * for counts. It means anyone can publish and subscribe.
             */

            if (perm.subscribeExpiration >= Math.round(Date.now() / 1000)) {
                subscriberCount = undefined
            }

            if (perm.publishExpiration >= Math.round(Date.now() / 1000)) {
                publisherCount = undefined
            }
        }

        if (
            perm.subscribeExpiration >= Math.round(Date.now() / 1000) &&
            subscriberCount != null
        ) {
            subscriberCount += 1
        }

        if (
            perm.publishExpiration >= Math.round(Date.now() / 1000) &&
            publisherCount != null
        ) {
            publisherCount += 1
        }
    })

    return {
        subscriberCount,
        publisherCount,
    }
}

export function useGlobalStreamStatsQuery() {
    const chainId = useCurrentChainId()

    return useQuery({
        queryKey: ['useGlobalStreamStatsQuery', chainId],
        queryFn: async () => {
            try {
                const result = await getIndexerClient(chainId).query<
                    GetGlobalStreamsStatsQuery,
                    GetGlobalStreamsStatsQueryVariables
                >({
                    query: GetGlobalStreamsStatsDocument,
                })

                const { messagesPerSecond, streamCount } = result.data.summary

                return {
                    messagesPerSecond,
                    streamCount,
                }
            } catch (e) {
                console.warn('Fetching global streams stats failed', e)
            }
        },
    })
}
