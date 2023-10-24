import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { COLORS, DESKTOP, TABLET } from '~/shared/utils/styled'
import Button from '~/shared/components/Button'
import Layout from '~/components/Layout'
import SearchBar from '~/shared/components/SearchBar'
import {
    IndexerOrderBy,
    IndexerOrderDirection,
    IndexerResult,
    TheGraphStreamResult,
    getPagedStreams,
    getPagedStreamsFromIndexer,
    getStreams,
    getStreamsFromIndexer,
} from '~/services/streams'
import {
    ActionBarContainer,
    FiltersBar,
    FiltersWrap,
    SearchBarWrap,
} from '~/components/ActionBar.styles'
import { PageWrap } from '~/shared/components/PageWrap'
import StreamTable, {
    ListOrderBy,
    ListOrderDirection,
} from '~/shared/components/StreamTable'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useWalletAccount } from '~/shared/stores/wallet'
import { OrderDirection, Stream_OrderBy } from '~/generated/gql/network'
import { address0 } from '~/consts'
import routes from '~/routes'

enum TabOption {
    All = 'all',
    Your = 'your',
}

function isTabOption(value: unknown): value is TabOption {
    return value === TabOption.All || value === TabOption.Your
}

const PAGE_SIZE = 10
const DEFAULT_ORDER_BY = ListOrderBy.MessagesPerSecond
const DEFAULT_ORDER_DIRECTION = ListOrderDirection.Desc

const mapOrderByToIndexer = (orderBy: ListOrderBy): IndexerOrderBy => {
    switch (orderBy) {
        case ListOrderBy.Id: {
            return IndexerOrderBy.Id
        }
        case ListOrderBy.MessagesPerSecond: {
            return IndexerOrderBy.MsgPerSecond
        }
        case ListOrderBy.PeerCount: {
            return IndexerOrderBy.PeerCount
        }
        default:
            return IndexerOrderBy.MsgPerSecond
    }
}

const mapOrderDirectionToIndexer = (
    orderDirection: ListOrderDirection,
): IndexerOrderDirection => {
    if (orderDirection === ListOrderDirection.Desc) {
        return IndexerOrderDirection.Desc
    }

    return IndexerOrderDirection.Asc
}

const mapOrderByToGraph = (orderBy: ListOrderBy): Stream_OrderBy => {
    switch (orderBy) {
        case ListOrderBy.Id: {
            return Stream_OrderBy.Id
        }
        default:
            return Stream_OrderBy.Id
    }
}

const mapOrderDirectionToGraph = (orderDirection: ListOrderDirection): OrderDirection => {
    if (orderDirection === ListOrderDirection.Desc) {
        return OrderDirection.Desc
    }

    return OrderDirection.Asc
}

const shouldUseIndexer = (orderBy: ListOrderBy) => {
    return orderBy === ListOrderBy.MessagesPerSecond || orderBy === ListOrderBy.PeerCount
}

const Container = styled.div`
    background-color: ${COLORS.secondary};

    padding: 24px 24px 80px 24px;

    @media ${TABLET} {
        padding: 45px 40px 90px 40px;
    }

    @media ${DESKTOP} {
        padding: 60px 0 130px;
    }
`

const TableContainer = styled.div`
    border-radius: 16px;
    background-color: white;
`

const StreamListingPage: React.FC = () => {
    const [params] = useSearchParams()

    const tab = params.get('tab')

    const streamsSelection = isTabOption(tab) ? tab : TabOption.All

    const [search, setSearch] = useState<string>('')

    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)

    const [orderDirection, setOrderDirection] = useState(DEFAULT_ORDER_DIRECTION)

    const account = useWalletAccount()

    const navigate = useNavigate()

    useEffect(() => {
        if (!account) {
            navigate(routes.streams.index({ tab: TabOption.All }))
        }
    }, [account, navigate])

    const streamsQuery = useInfiniteQuery({
        queryKey: ['streams', search, streamsSelection, account, orderBy, orderDirection],
        queryFn: async (ctx) => {
            const owner =
                streamsSelection === TabOption.Your ? account || address0 : undefined

            let result: TheGraphStreamResult | IndexerResult
            if (shouldUseIndexer(orderBy)) {
                result = await getPagedStreamsFromIndexer(
                    PAGE_SIZE,
                    ctx.pageParam,
                    owner,
                    search.toLowerCase(),
                    mapOrderByToIndexer(orderBy),
                    mapOrderDirectionToIndexer(orderDirection),
                )
            } else {
                result = await getPagedStreams(
                    PAGE_SIZE,
                    ctx.pageParam,
                    owner,
                    search.toLowerCase(),
                    mapOrderByToGraph(orderBy),
                    mapOrderDirectionToGraph(orderDirection),
                )
            }

            // Fetch stats
            statsQuery.fetchNextPage({
                pageParam: {
                    streamIds: result.streams.map((s) => s.id),
                    useIndexer: !shouldUseIndexer(orderBy),
                },
            })

            return result
        },
        getNextPageParam: (lastPage) => {
            const theGraphResult = lastPage as TheGraphStreamResult
            if (theGraphResult.lastId) {
                return theGraphResult.hasNextPage ? theGraphResult.lastId : null
            }

            const indexerResult = lastPage as IndexerResult
            if (indexerResult.cursor) {
                return indexerResult.hasNextPage ? indexerResult.cursor : null
            }

            return null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    const statsQuery = useInfiniteQuery({
        queryKey: ['streamStats'],
        queryFn: async (ctx) => {
            if (ctx.pageParam == null) {
                return
            }

            if (ctx.pageParam.useIndexer) {
                const indexerStats = await getStreamsFromIndexer(ctx.pageParam.streamIds)
                return indexerStats
            }

            const indexerStats = await getStreams(ctx.pageParam.streamIds)
            return indexerStats
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    // If indexer errors fall back to using The Graph
    useEffect(() => {
        if (streamsQuery.isError && shouldUseIndexer(orderBy)) {
            setOrderBy(ListOrderBy.Id)
            setOrderDirection(ListOrderDirection.Asc)
        }
    }, [streamsQuery.isError, orderBy])

    return (
        <Layout pageTitle="Streams">
            <ActionBarContainer>
                <SearchBarWrap>
                    <SearchBar
                        value={search}
                        onChange={(value) => {
                            setSearch(value)
                        }}
                    />
                </SearchBarWrap>
                <FiltersBar>
                    <FiltersWrap>
                        <Tabs
                            selection={streamsSelection}
                            onSelectionChange={(id) => {
                                navigate(routes.streams.index({ tab: id }))
                            }}
                        >
                            <Tab id={TabOption.All}>All streams</Tab>
                            <Tab
                                id={TabOption.Your}
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
                    <Button tag={Link} to={routes.streams.new()}>
                        Create stream
                    </Button>
                </FiltersBar>
            </ActionBarContainer>
            <LoadingIndicator
                loading={
                    streamsQuery.isLoading ||
                    streamsQuery.isFetching ||
                    streamsQuery.isFetchingNextPage
                }
            />
            <PageWrap>
                <Container>
                    <TableContainer>
                        <StreamTable
                            title={`${
                                streamsSelection === TabOption.All ? 'All' : 'Your'
                            } Streams`}
                            streams={
                                streamsQuery.data?.pages.flatMap((d) => d.streams) ?? []
                            }
                            streamStats={Object.fromEntries(
                                (statsQuery.data?.pages ?? [])
                                    .filter((p) => p != null)
                                    .flatMap((p) => p)
                                    .map((s) => [s.id, s]),
                            )}
                            loadMore={() => streamsQuery.fetchNextPage()}
                            hasMoreResults={streamsQuery.hasNextPage ?? false}
                            showGlobalStats={streamsSelection === TabOption.All}
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            onSortChange={(orderBy, orderDirection) => {
                                setOrderBy(orderBy)
                                setOrderDirection(orderDirection)
                            }}
                            noStreamsText={
                                streamsSelection === TabOption.Your && !search ? (
                                    <>You haven&apos;t created any streams yet</>
                                ) : (
                                    void 0
                                )
                            }
                        />
                    </TableContainer>
                </Container>
            </PageWrap>
        </Layout>
    )
}

export default StreamListingPage
