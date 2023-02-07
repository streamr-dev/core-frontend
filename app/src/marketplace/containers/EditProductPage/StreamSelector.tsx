import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import { Stream } from 'streamr-client'
import styled from 'styled-components'
import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import StreamTable from '$shared/components/StreamTable'
import { StreamId } from '$shared/types/stream-types'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { StreamSelectTable } from '$shared/components/StreamSelectTable'
import SearchBar from '$shared/components/SearchBar'
import { COLORS, DESKTOP, MEDIUM, TABLET } from '$shared/utils/styled'

const BATCH_SIZE = 10

const Heading = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding-bottom: 30px;

  @media ${TABLET} {
    padding-bottom: 45px
  }

  @media ${DESKTOP} {
    padding-bottom: 55px;
  }
`

const Title = styled.div`
  font-size: 34px;
  line-height: 34px;
  color: black;
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

export const StreamSelector: FunctionComponent = () => {
    const {state: project} = useContext(ProjectStateContext)
    const {updateStreams} = useEditableProjectActions()
    const [search, setSearch] = useState<string>('')
    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()
    const [streams, setStreams] = useState<Array<Stream>>([])
    const [hasMore, setHasMore] = useState<boolean>(false)
    const fetch = useCallback(async () => {
        const { requireUninterrupted } = itp(search)

        try {
            const [newStreams, hasMoreResults, isFirstBatch] = await fetchStreams(search, {
                batchSize: BATCH_SIZE,
                allowPublic: false,
                onlyCurrentUser: true,
            })
            requireUninterrupted()
            setHasMore(hasMoreResults)

            if (isFirstBatch) {
                setStreams(newStreams)
                return
            }

            setStreams((current = []) => [...current, ...newStreams])
        } catch (e) {
            if (e instanceof InterruptionError) {
                return
            }

            console.warn(e)
        }
    }, [itp, fetchStreams, search])

    useEffect(() => {
        fetch()
    }, [fetch])

    return <div>
        <Heading>
            <Title>Add Streams</Title>
            <Stat>Streams <strong>{streams.length}</strong></Stat>
            <Stat>Msg/s <strong>100</strong></Stat>
        </Heading>
        <SearchBar
            placeholder={'Search stream'}
            value={search}
            onChange={(value) => {
                setSearch(value)
            }}
        />
        <StreamSelectTable
            streams={streams}
            loadMore={fetch}
            hasMoreResults={hasMore}
            onSelectionChange={updateStreams}
            selected={project.streams}
        />
    </div>
}
