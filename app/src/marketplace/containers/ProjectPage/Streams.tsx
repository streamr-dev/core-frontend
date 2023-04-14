import React, { useCallback, useMemo, useEffect, useState, FunctionComponent } from 'react'
import { Stream, StreamID } from 'streamr-client'
import styled from 'styled-components'
import { TABLET } from '$shared/utils/styled'
import StreamTable from '$shared/components/StreamTable'
import { Project } from '$mp/types/project-types'
import { getStreamsFromIndexer, IndexerStream } from '$app/src/services/streams'
import useLoadProductStreamsCallback from '$mp/containers/ProductController/useLoadProductStreamsCallback'

const PAGE_SIZE = 5
const INITIAL_OFFSET = 2 * PAGE_SIZE

const StreamsContainer = styled.div`
    background-color: white;
    border-radius: 16px;
    margin-top: 16px;
    @media (${TABLET}) {
        margin-top: 24px;
    }
`

const Streams: FunctionComponent<{ project: Project }> = ({ project }) => {
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamStats, setStreamStats] = useState<Record<StreamID, IndexerStream>>({})
    const [offset, setOffset] = useState(INITIAL_OFFSET)
    const loadStreams = useLoadProductStreamsCallback({ setProductStreams: setStreams })

    useEffect(() => {
        loadStreams(project.streams.slice(0, INITIAL_OFFSET))
    }, [project.streams, loadStreams])

    useEffect(() => {
        const getStreamStats = async () => {
            try {
                const stats = await getStreamsFromIndexer(streams.map((s) => s.id))

                if (stats && stats.length > 0) {
                    setStreamStats((prev) => ({
                        ...prev,
                        ...Object.fromEntries(stats.map((is) => [is.id, is])),
                    }))
                }
            } catch (e) {
                console.warn('Fetching stream stats failed', e)
            }
        }
        getStreamStats()
    }, [streams])

    const hasMoreResults = useMemo(() => offset < project.streams.length, [offset, project.streams])

    const onLoadMore = useCallback(() => {
        loadStreams(project.streams.slice(offset, offset + PAGE_SIZE))
        setOffset(offset + PAGE_SIZE)
    }, [offset, setOffset, loadStreams, project.streams])

    return (
        <>
            {streams && streams.length > 0 && (
                <StreamsContainer>
                    <StreamTable
                        streams={streams}
                        loadMore={onLoadMore}
                        hasMoreResults={hasMoreResults}
                        streamStats={streamStats}
                        showGlobalStats={false}
                    />
                </StreamsContainer>
            )}
        </>
    )
}

export default Streams
