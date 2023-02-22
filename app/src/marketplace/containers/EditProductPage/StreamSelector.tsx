import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreamsFromIndexer from '$app/src/shared/hooks/useFetchStreamsFromIndexer'
import { IndexerStream } from '$app/src/services/streams'
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
    const fetchStreams = useFetchStreamsFromIndexer()
    const [streams, setStreams] = useState<Array<IndexerStream>>([])
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
