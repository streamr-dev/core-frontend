import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import LoadMore from '$mp/components/LoadMore'
import { StreamId } from '$shared/types/stream-types'
import { COLORS, MEDIUM, REGULAR, DESKTOP, TABLET } from '$shared/utils/styled'
import Checkbox from '$shared/components/Checkbox'
import { IndexerStream } from '$app/src/services/streams'
import routes from '$routes'

const ROW_HEIGHT = 88

const Row = styled.div`
  align-items: center;
  padding-left: 24px;
`

const TableGrid = styled(Row)`
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(0, 1fr) 18px;

  @media ${TABLET} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 18px;
  }

  @media ${DESKTOP} {
    grid-template-columns: minmax(0, 3fr) repeat(5, minmax(0, 1fr)) 18px;
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
  height: ${({rowCount}) => Math.max(rowCount, 1) * (ROW_HEIGHT + 1)}px;
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
    flex?: boolean
}

const GridCell = styled.span<GridCellProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({onlyDesktop}) =>
        onlyDesktop &&
          css`
            display: none;

            @media ${DESKTOP} {
              display: block;
            }
          `}

  ${({onlyTablet}) =>
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

  ${({notOnTablet}) =>
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

  ${({flex}) => flex ? css`display: flex;` : ''}
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

const StreamDetails = styled.a`
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

type Props = {
    streams: Array<IndexerStream>,
    loadMore?: () => void | Promise<void>,
    hasMoreResults?: boolean,
    onSelectionChange: (selectedStreams: StreamId[]) => void
    selected: StreamId[]
}

export const StreamSelectTable: FunctionComponent<Props> = ({
    streams,
    loadMore,
    hasMoreResults,
    onSelectionChange,
    selected
}: Props) => {
    const [selectedStreams, setSelectedStreams] = useState<Record<StreamId, boolean>>({})
    const [allSelected, setAllSelected] = useState<boolean>(false)

    const emitSelectedStreamsChange = useCallback((streams: Record<StreamId, boolean>) => {
        if (onSelectionChange) {
            const selectedStreamsArray = Object.entries(streams)
                .filter(([streamId, isSelected]) => isSelected)
                .map(([streamId]) => streamId)
            onSelectionChange(selectedStreamsArray)
        }
    }, [onSelectionChange])

    const handleSelectChange = useCallback((streamId: StreamId) => {
        const newSelectedStreams = {...selectedStreams, [streamId]: !selectedStreams[streamId]}
        setSelectedStreams(newSelectedStreams)
        emitSelectedStreamsChange(newSelectedStreams)
    }, [selectedStreams, emitSelectedStreamsChange])

    const handleSelectAllChange = useCallback(() => {
        const shouldAllBeChecked = !allSelected
        const newSelectedStreams: Record<StreamId, boolean> = {}
        streams.forEach((stream) => {
            newSelectedStreams[stream.id] = shouldAllBeChecked
        })
        setSelectedStreams(newSelectedStreams)
        setAllSelected(shouldAllBeChecked)
        emitSelectedStreamsChange(newSelectedStreams)
    }, [allSelected, streams, emitSelectedStreamsChange])

    useEffect(() => {
        const selectedStreamsArray = Object.entries(selectedStreams)
            .filter(([streamId, isSelected]) => isSelected)
            .map(([streamId]) => streamId)
        if (streams.length > 0 && selectedStreamsArray.length === streams.length && !allSelected) {
            setAllSelected(true)
        }
        if (selectedStreamsArray.length !== streams.length && allSelected) {
            setAllSelected(false)
        }
    }, [selectedStreams, streams, allSelected])

    useEffect(() => {
        if (selected && selected.length) {
            const newSelectedStreams: Record<StreamId, boolean> = {}
            selected.forEach((streamId) => {
                newSelectedStreams[streamId] = true
            })
            setSelectedStreams(newSelectedStreams)
        }
    }, [selected])

    return (
        <div>
            <Table>
                <TableHeader>
                    <GridCell>Stream ID</GridCell>
                    <GridCell onlyTablet>Description</GridCell>
                    <GridCell onlyDesktop>Live peers</GridCell>
                    <GridCell onlyDesktop>Msg/s</GridCell>
                    <GridCell onlyDesktop>Access</GridCell>
                    <GridCell onlyDesktop>Publishers</GridCell>
                    <GridCell onlyDesktop>Subscribers</GridCell>
                    <GridCell flex={true}>
                        <Checkbox value={allSelected} onChange={handleSelectAllChange}/>
                    </GridCell>
                </TableHeader>
                <TableRows rowCount={streams.length}>
                    {streams.map((s) => (
                        <TableRow key={s.id}>
                            <StreamDetails href={routes.streams.show({id: s.id})}>
                                <StreamId>
                                    {s.id}
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
                            <GridCell onlyDesktop>{s.publisherCount || '-'}</GridCell>
                            <GridCell onlyDesktop>{s.subscriberCount || '-'}</GridCell>
                            <GridCell flex={true}>
                                <Checkbox value={selectedStreams[s.id]} onChange={() => {
                                    handleSelectChange(s.id)
                                }}/>
                            </GridCell>
                        </TableRow>
                    ))}
                    {streams.length === 0 && <NoStreams>No streams that match your query</NoStreams>}
                </TableRows>
            </Table>
            {loadMore != null && (
                <LoadMore
                    hasMoreSearchResults={!!hasMoreResults}
                    onClick={loadMore}
                    preserveSpace={false}
                />
            )}
        </div>
    )
}
