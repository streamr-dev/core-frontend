import { UseInfiniteQueryResult, useQuery } from '@tanstack/react-query'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { LoadMoreButton } from '~/components/LoadMore'
import { StreamIdCell } from '~/components/Table'
import {
    GetStreamsResult,
    StreamStats,
    StreamsOrderBy,
    getStreamsFromIndexer,
    isIndexerColumn,
} from '~/hooks/streams'
import { Route as R } from '~/utils/routes'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useCurrentChainId } from '~/utils/chains'
import { OrderDirection } from '~/types'
import { useCurrentChainSymbolicName } from '~/utils/chains'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    onOrderChange?: (orderBy: StreamsOrderBy, orderDirection?: OrderDirection) => void
    orderBy?: StreamsOrderBy
    orderDirection?: OrderDirection
    query: UseInfiniteQueryResult<GetStreamsResult, unknown>
}

export function QueriedStreamsTable({
    noDataFirstLine,
    noDataSecondLine,
    onOrderChange,
    orderBy = 'mps',
    orderDirection,
    query,
}: Props) {
    const pages = query.data?.pages || []

    const streams = pages.flatMap((d) => d.streams) || []

    const [streamStats, setStreamStats] = useState<
        Record<string, StreamStats | undefined>
    >({})

    const chainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    const indexerQueryErrored = query.isError && isIndexerColumn(chainId, orderBy)

    const onOrderChangeRef = useRef(onOrderChange)

    if (onOrderChangeRef.current !== onOrderChange) {
        onOrderChangeRef.current = onOrderChange
    }

    useEffect(
        function fallbackToGraphOnIndexerError() {
            if (!indexerQueryErrored) {
                return
            }

            onOrderChangeRef.current?.('id', 'asc')
        },
        [indexerQueryErrored],
    )

    return (
        <>
            {pages.map((page) => (
                <StreamStatsLoader
                    key={page.pageId}
                    page={page}
                    onStats={(stats) => {
                        setStreamStats((current) => ({
                            ...current,
                            ...stats,
                        }))
                    }}
                />
            ))}
            <ScrollTableCore
                noDataFirstLine={noDataFirstLine}
                noDataSecondLine={noDataSecondLine}
                elements={streams}
                orderBy={orderBy}
                orderDirection={orderDirection}
                onOrderChange={(orderBy) => {
                    onOrderChange?.(orderBy as StreamsOrderBy)
                }}
                isLoading={
                    query.isLoading || query.isFetching || query.isFetchingNextPage
                }
                columns={[
                    {
                        key: 'id',
                        displayName: 'Stream ID',
                        isSticky: true,
                        sortable: true,
                        valueMapper: ({ id, description }) => (
                            <StreamIdCell streamId={id} description={description || ''} />
                        ),
                    },
                    {
                        key: 'peerCount',
                        displayName: 'Nodes',
                        sortable: true,
                        valueMapper: ({ id, peerCount = streamStats[id]?.peerCount }) =>
                            peerCount ?? '-',
                    },
                    {
                        key: 'mps',
                        displayName: 'Msg/s',
                        sortable: true,
                        valueMapper: ({
                            id,
                            messagesPerSecond: mps = streamStats[id]?.messagesPerSecond,
                        }) => mps ?? '-',
                    },
                    {
                        key: 'access',
                        displayName: 'Access',
                        valueMapper: ({ subscriberCount }) =>
                            subscriberCount == null ? 'Public' : 'Private',
                    },
                    {
                        key: 'publishers',
                        displayName: 'Publishers',
                        valueMapper: ({ publisherCount = '∞' }) => publisherCount,
                    },
                    {
                        key: 'subscribers',
                        displayName: 'Subscribers',
                        valueMapper: ({ subscriberCount = '∞' }) => subscriberCount,
                    },
                ]}
                linkMapper={(element) =>
                    R.stream(element.id, {
                        search: { chain: chainName },
                    })
                }
            />
            {query.hasNextPage && (
                <LoadMoreButton
                    disabled={query.isLoading || query.isFetching}
                    onClick={() => {
                        query.fetchNextPage()
                    }}
                    kind="primary2"
                >
                    Load more
                </LoadMoreButton>
            )}
        </>
    )
}

interface StreamStatsLoaderProps {
    page: GetStreamsResult
    onStats?(stats: Partial<Record<string, StreamStats>>): void
}

function StreamStatsLoader({ onStats, page }: StreamStatsLoaderProps) {
    const chainId = useCurrentChainId()

    const streamIdsRef = useRef(page.streams.map(({ id }) => id))

    const { data: result } = useQuery({
        queryKey: ['StreamStatsLoader.statsQuery', chainId, page.pageId, page.source],
        queryFn: async (): Promise<Partial<Record<string, StreamStats>>> => {
            if (page.source === 'indexer') {
                return {}
            }

            try {
                const { streams } = await getStreamsFromIndexer(chainId, {
                    force: true,
                    pageSize: Math.min(1000, streamIdsRef.current.length),
                    streamIds: streamIdsRef.current,
                })

                const stats: Partial<Record<string, StreamStats>> = {}

                for (const { id, messagesPerSecond, peerCount } of streams) {
                    stats[id] = {
                        messagesPerSecond,
                        peerCount,
                    }
                }

                return stats
            } catch (_) {
                // ¯\_(ツ)_/¯
            }

            return {}
        },
        staleTime: 5 * 60000,
    })

    const resultRef = useRef(result)

    if (resultRef.current !== result) {
        resultRef.current = result

        if (result) {
            onStats?.(result)
        }
    }

    return <></>
}
