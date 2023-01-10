import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import { Stream } from 'streamr-client'
import InterruptionError from '$shared/errors/InterruptionError'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import StreamTable from '$shared/components/StreamTable'
import { StreamId } from '$shared/types/stream-types'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'

const BATCH_SIZE = 10

export const StreamSelector: FunctionComponent = () => {

    const {state: project} = useContext(ProjectStateContext)
    const {updateStreams} = useEditableProjectActions()
    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()
    const [streams, setStreams] = useState<Array<Stream>>([])
    const [hasMore, setHasMore] = useState<boolean>(false)
    const fetch = useCallback(async () => {
        const { requireUninterrupted } = itp('')

        try {
            const [newStreams, hasMoreResults, isFirstBatch] = await fetchStreams('',{
                batchSize: BATCH_SIZE,
                allowPublic: false,
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
    }, [itp, fetchStreams])

    useEffect(() => {
        fetch()
    }, [fetch])

    return streams.length ? <StreamTable
        title={'Add Streams'}
        streams={streams}
        loadMore={fetch}
        hasMoreResults={hasMore}
        onSelectionChange={updateStreams}
        selected={project.streams}
    /> : <></>
}
