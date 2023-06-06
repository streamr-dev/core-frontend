import React, {
    useCallback,
    useMemo,
    useEffect,
    useState,
    FunctionComponent,
} from 'react'
import { Stream, StreamID } from 'streamr-client'
import styled from 'styled-components'
import { TABLET } from '$shared/utils/styled'
import StreamTable, { StreamTableLight } from '$shared/components/StreamTable'
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

interface Props {
    streams: string[]
}

export default function Streams({ streams: streamsProp }: Props) {
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamStats, setStreamStats] = useState<Record<StreamID, IndexerStream>>({})
    const [offset, setOffset] = useState(INITIAL_OFFSET)

    const appendStreams = useCallback((streams: Stream[]) => {
        setStreams((prev) => [...prev, ...streams])
    }, [])

    const loadStreams = useLoadProductStreamsCallback({
        setProductStreams: appendStreams,
    })

    useEffect(() => {
        loadStreams(streamsProp.slice(0, INITIAL_OFFSET))
    }, [streamsProp, loadStreams])

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

    const hasMoreResults = useMemo(
        () => offset < streamsProp.length,
        [offset, streamsProp],
    )

    const onLoadMore = useCallback(() => {
        loadStreams(streamsProp.slice(offset, offset + PAGE_SIZE))
        setOffset(offset + PAGE_SIZE)
    }, [offset, setOffset, loadStreams, streamsProp])

    return (
        <>
            {streamsProp &&
                streamsProp.length > 0 &&
                (!streams || streams.length === 0) && (
                    <StreamsContainer>
                        <StreamTableLight
                            streamIds={streamsProp.slice(0, INITIAL_OFFSET)}
                        />
                    </StreamsContainer>
                )}
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
