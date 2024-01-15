import React, {
    FunctionComponent,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react'
import styled, { css } from 'styled-components'
import { Stream } from 'streamr-client'
import { Link } from 'react-router-dom'

import LoadMore from '~/marketplace/components/LoadMore'
import { COLORS, MEDIUM, REGULAR, DESKTOP, TABLET } from '~/shared/utils/styled'
import {
    getGlobalStatsFromIndexer,
    GlobalStreamStats,
    IndexerStream,
    TheGraphStream,
} from '~/services/streams'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { truncateStreamName } from '~/shared/utils/text'
import routes from '~/routes'
import SvgIcon from '../SvgIcon'

const ROW_HEIGHT = 88

export enum ListOrderBy {
    MessagesPerSecond,
    PeerCount,
    Id,
}

export enum ListOrderDirection {
    Asc,
    Desc,
}

const Container = styled.div``

const Row = styled.div`
    align-items: center;
    padding-left: 24px;

    @media ${TABLET} {
        padding-left: 40px;
    }

    @media ${DESKTOP} {
        padding-left: 60px;
    }
`

const TableGrid = styled(Row)`
    display: grid;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr);

    @media ${TABLET} {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }

    @media ${DESKTOP} {
        grid-template-columns: minmax(0, 3fr) repeat(5, minmax(0, 1fr));
    }
`

const Table = styled.div`
    overflow: auto;
`

const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    height: ${ROW_HEIGHT}px;
    font-size: 15px;
    line-height: 26px;
    color: ${COLORS.primaryLight};
    border-bottom: 1px solid #f8f8f8;
    position: sticky;
    top: 0;
    z-index: 1;
`

type TableRowsProps = {
    rowCount: number
}

const TableRows = styled.div<TableRowsProps>`
    height: ${({ rowCount }) => Math.max(rowCount, 1) * (ROW_HEIGHT + 1)}px;
`

const TableRow = styled(TableGrid)`
    font-size: 16px;
    line-height: 26px;
    height: ${ROW_HEIGHT}px;
    max-height: ${ROW_HEIGHT}px;
    box-sizing: content-box;
    color: ${COLORS.primaryLight};
    transition: background-color 100ms ease-in-out;

    &:hover {
        background-color: ${COLORS.secondaryLight};
    }

    &:active {
        background-color: ${COLORS.click};
    }

    &:not(:last-child) {
        border-bottom: 1px solid #f8f8f8;
    }

    &:active,
    &:link,
    &:visited,
    &:hover {
        color: ${COLORS.primaryLight};
    }
`

type GridCellProps = {
    onlyDesktop?: boolean
    onlyTablet?: boolean
    notOnTablet?: boolean
    onClick?: () => void
}

const GridCell = styled.span<GridCellProps>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${({ onClick }) =>
        typeof onClick === 'function' &&
        css`
            cursor: pointer;
        `}

    ${({ onlyDesktop }) =>
        onlyDesktop &&
        css`
            display: none;

            @media ${DESKTOP} {
                display: block;
            }
        `}

    ${({ onlyTablet }) =>
        onlyTablet &&
        css`
            display: none;

            @media ${TABLET} {
                display: block;
            }

            @media ${DESKTOP} {
                display: none;
            }
        `}

    ${({ notOnTablet }) =>
        notOnTablet &&
        css`
            display: block;

            @media ${TABLET} {
                display: none;
            }

            @media ${DESKTOP} {
                display: block;
            }
        `}
`

const NoStreams = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    line-height: 18px;
    color: ${COLORS.primaryLight};
`

const StreamDetails = styled.span`
    font-size: 16px;
    line-height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
`

const StreamId = styled(GridCell)`
    font-weight: ${MEDIUM};
`

const StreamDescription = styled(GridCell)`
    font-weight: ${REGULAR};
`

const Heading = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 16px;
    align-items: center;
    padding: 30px 24px;

    @media ${TABLET} {
        padding: 45px 40px;
    }

    @media ${DESKTOP} {
        padding: 55px 60px;
    }
`

const Title = styled.div`
    font-size: 34px;
    line-height: 48px;
    color: ${COLORS.primary};
`

const Stat = styled.div`
    color: ${COLORS.primaryLight};
    background-color: ${COLORS.secondary};
    font-size: 18px;
    line-height: 16px;
    padding: 16px;

    strong {
        font-weight: ${MEDIUM};
    }
`

const OrderDirectionIcon = styled(SvgIcon)<{ direction: ListOrderDirection }>`
    width: 12px;
    transform: ${({ direction }) =>
        direction === ListOrderDirection.Asc ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 180ms ease-in-out;
    margin-left: 8px;
`

const DirectionDefaults: Record<ListOrderBy, ListOrderDirection> = {
    [ListOrderBy.Id]: ListOrderDirection.Asc,
    [ListOrderBy.PeerCount]: ListOrderDirection.Desc,
    [ListOrderBy.MessagesPerSecond]: ListOrderDirection.Desc,
}

function isIndexerStream(
    stream: TheGraphStream | IndexerStream | Stream,
): stream is IndexerStream {
    return (stream as IndexerStream).peerCount !== undefined
}

type Props = {
    title?: string
    streams: Array<TheGraphStream | IndexerStream | Stream>
    streamStats: Record<string, TheGraphStream | IndexerStream>
    loadMore?: () => void
    hasMoreResults?: boolean
    showGlobalStats: boolean
    orderBy?: ListOrderBy
    orderDirection?: ListOrderDirection
    onSortChange?: (orderBy: ListOrderBy, orderDirection: ListOrderDirection) => void
    noStreamsText?: ReactNode
}

const StreamTable: React.FC<Props> = ({
    title = 'Streams',
    streams,
    streamStats,
    loadMore,
    hasMoreResults,
    showGlobalStats,
    orderBy,
    orderDirection,
    onSortChange,
    noStreamsText = 'No streams that match your query',
}: Props) => {
    const [globalStats, setGlobalStats] = useState<GlobalStreamStats | null>(null)
    const isMounted = useIsMounted()

    const handleHeaderClick = useCallback(
        (field: ListOrderBy) => {
            if (typeof onSortChange === 'function') {
                let newDirection = DirectionDefaults[field] ?? ListOrderDirection.Desc
                // If field was not changed, flip the direction
                if (orderBy === field) {
                    newDirection = Number(!orderDirection) as ListOrderDirection
                }
                onSortChange(field, newDirection)
            }
        },
        [onSortChange, orderDirection, orderBy],
    )

    useEffect(() => {
        const loadStats = async () => {
            try {
                const result = await getGlobalStatsFromIndexer()

                if (isMounted()) {
                    setGlobalStats(result)
                }
            } catch (e) {
                console.error(e)
            }
        }

        if (showGlobalStats) {
            loadStats()
        }
    }, [isMounted, showGlobalStats])

    return (
        <Container>
            <Heading>
                <Title>{title}</Title>
                {showGlobalStats && globalStats != null && (
                    <>
                        <Stat>
                            Streams <strong>{globalStats.streamCount}</strong>
                        </Stat>
                        <Stat>
                            Msg/s{' '}
                            <strong>{globalStats.messagesPerSecond.toFixed(0)}</strong>
                        </Stat>
                    </>
                )}
            </Heading>
            <Table>
                <TableHeader>
                    <GridCell onClick={() => handleHeaderClick(ListOrderBy.Id)}>
                        Stream ID
                        {orderBy === ListOrderBy.Id && (
                            <OrderDirectionIcon
                                name="caretDown"
                                direction={orderDirection ?? ListOrderDirection.Asc}
                            />
                        )}
                    </GridCell>
                    <GridCell onlyTablet>Description</GridCell>
                    <GridCell
                        onlyDesktop
                        onClick={() => handleHeaderClick(ListOrderBy.PeerCount)}
                    >
                        Live peers
                        {orderBy === ListOrderBy.PeerCount && (
                            <OrderDirectionIcon
                                name="caretDown"
                                direction={orderDirection ?? ListOrderDirection.Asc}
                            />
                        )}
                    </GridCell>
                    <GridCell
                        onlyDesktop
                        onClick={() => handleHeaderClick(ListOrderBy.MessagesPerSecond)}
                    >
                        Msg/s
                        {orderBy === ListOrderBy.MessagesPerSecond && (
                            <OrderDirectionIcon
                                name="caretDown"
                                direction={orderDirection ?? ListOrderDirection.Asc}
                            />
                        )}
                    </GridCell>
                    <GridCell onlyDesktop>Access</GridCell>
                    <GridCell onlyDesktop>Publishers</GridCell>
                    <GridCell onlyDesktop>Subscribers</GridCell>
                </TableHeader>
                <TableRows rowCount={streams.length}>
                    {streams.map((s) => {
                        const stats =
                            streamStats && streamStats[s.id] != null
                                ? streamStats[s.id]
                                : null
                        let publisherCount: number | null | undefined
                        let subscriberCount: number | null | undefined
                        let description: string
                        let peerCount: number | null | undefined
                        let messagesPerSecond: number | null | undefined

                        if (s instanceof Stream) {
                            const indexerStats = stats as IndexerStream
                            description = s.getMetadata().description ?? ''
                            publisherCount = indexerStats?.publisherCount
                            subscriberCount = indexerStats?.subscriberCount
                            peerCount = indexerStats?.peerCount
                            messagesPerSecond = indexerStats?.messagesPerSecond
                        } else if (isIndexerStream(s)) {
                            publisherCount = s.publisherCount
                            subscriberCount = s.subscriberCount

                            // For pub/sub count, show values from stats (The Graph) once the data is available.
                            // Until that show (possibly wrong) value from the indexer. One exception is that
                            // if we have more than 100 permissions, use indexer (because The Graph caps subentity count at 100).
                            const graphStats = stats as TheGraphStream
                            if (
                                graphStats != null &&
                                graphStats?.publisherCount !== 100
                            ) {
                                publisherCount = graphStats.publisherCount
                            }
                            if (
                                graphStats != null &&
                                graphStats?.subscriberCount !== 100
                            ) {
                                subscriberCount = graphStats.subscriberCount
                            }
                            description = s.description ?? ''
                            peerCount = s.peerCount
                            messagesPerSecond = s.messagesPerSecond
                        } else {
                            publisherCount = s.publisherCount
                            subscriberCount = s.subscriberCount
                            description = s.metadata?.description ?? ''
                            peerCount = (stats as IndexerStream)?.peerCount
                            messagesPerSecond = (stats as IndexerStream)
                                ?.messagesPerSecond
                        }

                        return (
                            <TableRow
                                key={s.id}
                                as={Link}
                                to={routes.streams.show({ id: s.id })}
                            >
                                <StreamDetails>
                                    <StreamId title={s.id}>
                                        {truncateStreamName(s.id, 40)}
                                    </StreamId>
                                    {'\n'}
                                    <StreamDescription notOnTablet>
                                        {description}
                                    </StreamDescription>
                                </StreamDetails>
                                <GridCell onlyTablet>{description}</GridCell>
                                <GridCell onlyDesktop>{peerCount ?? '-'}</GridCell>
                                <GridCell onlyDesktop>
                                    {messagesPerSecond ?? '-'}
                                </GridCell>
                                <GridCell onlyDesktop>
                                    {subscriberCount == null ? 'Public' : 'Private'}
                                </GridCell>
                                <GridCell onlyDesktop>
                                    {publisherCount === null
                                        ? '∞'
                                        : publisherCount ?? '-'}
                                </GridCell>
                                <GridCell onlyDesktop>
                                    {subscriberCount === null
                                        ? '∞'
                                        : subscriberCount ?? '-'}
                                </GridCell>
                            </TableRow>
                        )
                    })}
                    {streams.length === 0 && <NoStreams>{noStreamsText}</NoStreams>}
                </TableRows>
            </Table>
            {loadMore != null && (
                <LoadMore
                    hasMoreSearchResults={!!hasMoreResults}
                    onClick={() => {
                        loadMore()
                    }}
                    preserveSpace
                />
            )}
        </Container>
    )
}

export default StreamTable

export const StreamTableLight: FunctionComponent<{
    streamIds: string[]
    title?: string
}> = ({ streamIds, title = 'Streams' }) => {
    return (
        <Container>
            <Heading>
                <Title>{title}</Title>
            </Heading>
            <Table>
                <TableHeader>
                    <GridCell>Stream ID</GridCell>
                    <GridCell onlyTablet>Description</GridCell>
                    <GridCell onlyDesktop>Live peers</GridCell>
                    <GridCell onlyDesktop>Msg/s</GridCell>
                    <GridCell onlyDesktop>Access</GridCell>
                    <GridCell onlyDesktop>Publishers</GridCell>
                    <GridCell onlyDesktop>Subscribers</GridCell>
                </TableHeader>
                <TableRows rowCount={streamIds.length}>
                    {streamIds.map((streamId) => (
                        <TableRow
                            key={streamId}
                            as={Link}
                            to={routes.streams.show({ id: streamId })}
                        >
                            <StreamDetails>
                                <StreamId title={streamId}>
                                    {truncateStreamName(streamId, 40)}
                                </StreamId>
                            </StreamDetails>
                            <GridCell onlyTablet />
                            <GridCell onlyDesktop>-</GridCell>
                            <GridCell onlyDesktop>-</GridCell>
                            <GridCell onlyDesktop>-</GridCell>
                            <GridCell onlyDesktop>-</GridCell>
                            <GridCell onlyDesktop>-</GridCell>
                        </TableRow>
                    ))}
                </TableRows>
            </Table>
        </Container>
    )
}
