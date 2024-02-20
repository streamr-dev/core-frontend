import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    ActionBarContainer,
    FiltersBar,
    FiltersWrap,
} from '~/components/ActionBar.styles'
import { Button } from '~/components/Button'
import Layout, { LayoutColumn } from '~/components/Layout'
import { LoadMoreButton } from '~/components/LoadMore'
import NetworkPageSegment, {
    SegmentGrid,
    TitleBar,
} from '~/components/NetworkPageSegment'
import { StreamIdCell } from '~/components/Table'
import {
    StreamsOrderBy,
    StreamsTabOption,
    isIndexerColumn,
    isStreamsTabOption,
    useStreamsQuery,
    useStreamsStatsQuery,
} from '~/hooks/streams'
import { useTableOrder } from '~/hooks/useTableOrder'
import routes from '~/routes'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import SearchBar, { SearchBarWrap } from '~/shared/components/SearchBar'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useWalletAccount } from '~/shared/stores/wallet'

export function StreamsPage() {
    const [search, setSearch] = useState('')

    const [params] = useSearchParams()

    const tabParam = params.get('tab')

    const tab = isStreamsTabOption(tabParam) ? tabParam : StreamsTabOption.All

    const navigate = useNavigate()

    const account = useWalletAccount()

    useEffect(
        function changeToAllTabOnWalletLock() {
            if (account) {
                return
            }

            navigate(routes.streams.index({ tab: StreamsTabOption.All }))
        },
        [account, navigate],
    )

    const {
        orderBy = 'mps',
        orderDirection = 'desc',
        setOrder,
    } = useTableOrder<StreamsOrderBy>()

    const streamsStatsQuery = useStreamsStatsQuery()

    const streamsQuery = useStreamsQuery({
        onBatch({ streamIds, source }) {
            streamsStatsQuery.fetchNextPage({
                pageParam: {
                    streamIds,
                    useIndexer: source !== 'indexer',
                },
            })
        },
        orderBy,
        orderDirection,
        search,
        tab,
    })

    const indexerQueryErrored = streamsQuery.isError && isIndexerColumn(orderBy)

    useEffect(
        function fallbackToGraphOnIndexerError() {
            if (!indexerQueryErrored) {
                return
            }

            setOrder('id', 'asc')
        },
        [indexerQueryErrored, setOrder],
    )

    const streams = streamsQuery.data?.pages.flatMap((d) => d.streams) || []

    const streamStats = Object.fromEntries(
        (streamsStatsQuery.data?.pages || [])
            .filter((p) => p)
            .flatMap((p) => p!.streams)
            .map((s) => [s!.id, s]),
    )

    return (
        <Layout pageTitle="Streams">
            <ActionBarContainer>
                <SearchBarWrap>
                    <SearchBar
                        value={search}
                        onChange={(value) => void setSearch(value)}
                    />
                </SearchBarWrap>
                <FiltersBar>
                    <FiltersWrap>
                        <Tabs
                            selection={tab}
                            onSelectionChange={(id) => {
                                navigate(routes.streams.index({ tab: id }))
                            }}
                        >
                            <Tab id={StreamsTabOption.All}>All streams</Tab>
                            <Tab
                                id={StreamsTabOption.Your}
                                disabled={!account}
                                title={
                                    account
                                        ? undefined
                                        : 'Connect your wallet to view your streams'
                                }
                            >
                                Your streams
                            </Tab>
                        </Tabs>
                    </FiltersWrap>
                    <div>
                        <Button as={Link} to={routes.streams.new()}>
                            Create stream
                        </Button>
                    </div>
                </FiltersBar>
            </ActionBarContainer>
            <LayoutColumn>
                <SegmentGrid>
                    <NetworkPageSegment
                        foot
                        title={<TitleBar label="0">All Streams</TitleBar>}
                    >
                        <ScrollTableCore
                            elements={streams}
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            onOrderChange={(orderBy) => {
                                setOrder(orderBy as StreamsOrderBy)
                            }}
                            isLoading={
                                streamsQuery.isLoading ||
                                streamsQuery.isFetching ||
                                streamsQuery.isFetchingNextPage
                            }
                            columns={[
                                {
                                    key: 'id',
                                    displayName: 'Stream ID',
                                    isSticky: true,
                                    sortable: true,
                                    valueMapper: ({ id, description }) => (
                                        <StreamIdCell
                                            streamId={id}
                                            description={description || ''}
                                        />
                                    ),
                                },
                                {
                                    key: 'peerCount',
                                    displayName: 'Live peers',
                                    sortable: true,
                                    valueMapper: ({
                                        id,
                                        peerCount = streamStats[id]?.peerCount,
                                    }) => peerCount ?? '-',
                                },
                                {
                                    key: 'mps',
                                    displayName: 'Msg/s',
                                    sortable: true,
                                    valueMapper: ({
                                        id,
                                        messagesPerSecond: mps = streamStats[id]
                                            ?.messagesPerSecond,
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
                                    valueMapper: ({ publisherCount = '∞' }) =>
                                        publisherCount,
                                },
                                {
                                    key: 'subscribers',
                                    displayName: 'Subscribers',
                                    valueMapper: ({ subscriberCount = '∞' }) =>
                                        subscriberCount,
                                },
                            ]}
                            linkMapper={(element) =>
                                routes.streams.show({ id: element.id })
                            }
                        />
                        {streamsQuery.hasNextPage && (
                            <LoadMoreButton
                                disabled={
                                    streamsQuery.isLoading || streamsQuery.isFetching
                                }
                                onClick={() => {
                                    streamsQuery.fetchNextPage()
                                }}
                                kind="primary2"
                            >
                                Load more
                            </LoadMoreButton>
                        )}
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}
