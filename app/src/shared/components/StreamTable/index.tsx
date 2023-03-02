import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

import LoadMore from '$mp/components/LoadMore'
import { COLORS, MEDIUM, REGULAR, DESKTOP, TABLET } from '$shared/utils/styled'
import { getGlobalStatsFromIndexer, GlobalStreamStats, IndexerStream } from '$app/src/services/streams'
import useIsMounted from '$shared/hooks/useIsMounted'
import { truncate } from '$shared/utils/text'
import routes from '$routes'

const ROW_HEIGHT = 88

const Container = styled.div`
    padding-bottom: 80px;
`

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
    rowCount: number,
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

    &:not(:last-child) {
        border-bottom: 1px solid #f8f8f8;
    }
`

type GridCellProps = {
    onlyDesktop?: boolean,
    onlyTablet?: boolean,
    notOnTablet?: boolean,
}

const GridCell = styled.span<GridCellProps>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

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

const StreamDetails = styled(Link)`
    font-size: 16px;
    line-height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;    

    &:active,
    &:link,
    &:visited,
    &:hover {
        color: ${COLORS.primaryLight};
    }
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

type Props = {
    title?: string,
    streams: Array<IndexerStream>,
    loadMore?: () => void | Promise<void>,
    hasMoreResults?: boolean,
    showGlobalStats: boolean,
}

const StreamTable: React.FC<Props> = ({ title = "Streams", streams, loadMore, hasMoreResults, showGlobalStats }: Props) => {
    const [globalStats, setGlobalStats] = useState<GlobalStreamStats>(null)
    const isMounted = useIsMounted()

    useEffect(() => {
        const loadStats = async () => {
            const result = await getGlobalStatsFromIndexer()

            if (isMounted()) {
                setGlobalStats(result)
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
                        <Stat>Streams <strong>{globalStats.streamCount}</strong></Stat>
                        <Stat>Msg/s <strong>{globalStats.messagesPerSecond}</strong></Stat>
                    </>
                )}
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
                <TableRows rowCount={streams.length}>
                    {streams.map((s) => (
                        <TableRow key={s.id}>
                            <StreamDetails to={routes.streams.show({ id: s.id })}>
                                <StreamId
                                    title={s.id}
                                >
                                    {truncate(s.id)}
                                </StreamId>
                                {'\n'}
                                <StreamDescription notOnTablet>
                                    {s.description}
                                </StreamDescription>
                            </StreamDetails>
                            <GridCell onlyTablet>{s.description}</GridCell>
                            <GridCell onlyDesktop>{s.peerCount}</GridCell>
                            <GridCell onlyDesktop>{s.messagesPerSecond}</GridCell>
                            <GridCell onlyDesktop>{s.subscriberCount == null ? 'Public' : 'Private'}</GridCell>
                            <GridCell onlyDesktop>{s.publisherCount || '∞'}</GridCell>
                            <GridCell onlyDesktop>{s.subscriberCount || '∞'}</GridCell>
                        </TableRow>
                    ))}
                    {streams.length === 0 && <NoStreams>No streams that match your query</NoStreams>}
                </TableRows>
            </Table>
            {loadMore != null && (
                <LoadMore
                    hasMoreSearchResults={!!hasMoreResults}
                    onClick={loadMore}
                    preserveSpace
                />
            )}
        </Container>
    )
}

export default StreamTable
