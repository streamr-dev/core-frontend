import { UseInfiniteQueryResult } from '@tanstack/react-query'
import React, { ReactNode, useEffect, useRef } from 'react'
import { GetStreamsResult, StreamsOrderBy, isIndexerColumn } from '~/hooks/streams'
import routes from '~/routes'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { OrderDirection } from '~/types'
import { LoadMoreButton } from '~/components/LoadMore'
import { StreamIdCell } from '~/components/Table'
import { useCurrentChainId } from '~/shared/stores/chain'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    onOrderChange?: (orderBy: StreamsOrderBy, orderDirection?: OrderDirection) => void
    orderBy?: StreamsOrderBy
    orderDirection?: OrderDirection
    query: UseInfiniteQueryResult<GetStreamsResult, unknown>
    statsQuery: UseInfiniteQueryResult<GetStreamsResult | undefined, unknown>
}

export function QueriedStreamsTable({
    noDataFirstLine,
    noDataSecondLine,
    onOrderChange,
    orderBy = 'mps',
    orderDirection,
    query,
    statsQuery,
}: Props) {
    const streams = query.data?.pages.flatMap((d) => d.streams) || []

    const streamStats = Object.fromEntries(
        (statsQuery.data?.pages || [])
            .filter((p) => p)
            .flatMap((p) => p!.streams)
            .map((s) => [s!.id, s]),
    )

    const chainId = useCurrentChainId()

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
                linkMapper={(element) => routes.streams.show({ id: element.id })}
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
