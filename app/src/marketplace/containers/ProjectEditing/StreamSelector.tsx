import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Stream, StreamID } from 'streamr-client'

import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$app/src/shared/hooks/useFetchStreams'
import { getStreamsFromIndexer, IndexerStream } from '$app/src/services/streams'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { StreamSelectTable } from '$shared/components/StreamSelectTable'
import SearchBar from '$shared/components/SearchBar'
import { DESKTOP, TABLET } from '$shared/utils/styled'

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
  line-height: 48px;
  color: black;
`

export const StreamSelector: FunctionComponent = () => {
    const {state: project} = useContext(ProjectStateContext)
    const {updateStreams} = useEditableProjectActions()
    const [search, setSearch] = useState<string>('')
    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()
    const [streams, setStreams] = useState<Array<Stream>>([])
    const [streamStats, setStreamStats] = useState<Record<StreamID, IndexerStream>>({})
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
            } else {
                setStreams((current = []) => [...current, ...newStreams])
            }

            try {
                const stats = await getStreamsFromIndexer(newStreams.map((s) => s.id))

                requireUninterrupted()
                if (stats && stats.length > 0) {
                    setStreamStats((prev) => ({
                        ...prev,
                        ...Object.fromEntries(stats.map((is) => [is.id, is]))
                    }))
                }
            } catch (e) {
                console.warn('Fetching stream stats failed', e)
            }
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
            streamStats={streamStats}
            loadMore={fetch}
            hasMoreResults={hasMore}
            onSelectionChange={updateStreams}
            selected={project.streams}
        />
    </div>
}
