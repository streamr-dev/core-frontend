import React from 'react'
import type { Stream } from 'streamr-client'
import styled, { css } from 'styled-components'

import { COLORS, MEDIUM, REGULAR, DESKTOP, TABLET } from '$shared/utils/styled'

const ROW_HEIGHT = 88

type Props = {
    streams: Array<Stream>,
}

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
    height: ${({ rowCount }) => rowCount * (ROW_HEIGHT + 1)}px;
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

const StreamDetails = styled.div`
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

const StreamTable: React.FC<Props> = ({ streams }: Props) => {
    return (
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
            <TableRows rowCount={Math.max(streams.length, 1)}>
                {streams.map((s) => (
                    <TableRow key={s.id}>
                        <StreamDetails>
                            <StreamId>
                                {s.id}
                            </StreamId>
                            {'\n'}
                            <StreamDescription>
                                {s.getMetadata().description}
                            </StreamDescription>
                        </StreamDetails>
                        <GridCell onlyTablet>{s.getMetadata().description}</GridCell>
                        <GridCell onlyDesktop>50</GridCell>
                        <GridCell onlyDesktop>1</GridCell>
                        <GridCell onlyDesktop>Public</GridCell>
                        <GridCell onlyDesktop>5</GridCell>
                        <GridCell onlyDesktop>100</GridCell>
                    </TableRow>
                ))}
                {streams.length === 0 && <NoStreams>No streams that match your query</NoStreams>}
            </TableRows>
        </Table>
    )
}

export default StreamTable
