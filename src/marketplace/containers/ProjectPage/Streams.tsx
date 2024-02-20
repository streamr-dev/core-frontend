import React, { useEffect, useState } from 'react'
import { Stream, StreamID } from 'streamr-client'
import isEqual from 'lodash/isEqual'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'
import { TABLET } from '~/shared/utils/styled'
import StreamTable, { StreamTableLight } from '~/shared/components/StreamTable'
import { getStreamsFromIndexer, IndexerStream } from '~/services/streams'
import { fetchStreamlikesByIds } from '~/utils'
import { useCurrentChainId } from '~/shared/stores/chain'

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

    const client = useClient()

    useEffect(() => {
        let mounted = true

        if (!client) {
            return
        }

        // Check if we have already everything loaded
        if (isEqual(sortBy(streamsProp), sortBy(streams.map((s) => s.id)))) {
            return
        }

        void (async () => {
            const loadedStreams = await fetchStreamlikesByIds(
                streamsProp.slice(0, INITIAL_OFFSET),
                client,
            )

            if (mounted) {
                setStreams((prev) => [...prev, ...(loadedStreams as Stream[])])
            }
        })()

        return () => {
            mounted = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streamsProp, client])

    const chainId = useCurrentChainId()

    useEffect(() => {
        const getStreamStats = async () => {
            try {
                const stats = await getStreamsFromIndexer(
                    chainId,
                    streams.map((s) => s.id),
                )

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
    }, [streams, chainId])

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
                        loadMore={() => {
                            /**
                             * @TODO Cancel interrupted loading.
                             */

                            if (!client) {
                                return
                            }

                            void (async () => {
                                const streams = await fetchStreamlikesByIds(
                                    streamsProp.slice(offset, offset + PAGE_SIZE),
                                    client,
                                )

                                setStreams((prev) => [...prev, ...(streams as Stream[])])
                            })()

                            setOffset((c) => c + PAGE_SIZE)
                        }}
                        hasMoreResults={offset < streamsProp.length}
                        streamStats={streamStats}
                        showGlobalStats={false}
                    />
                </StreamsContainer>
            )}
        </>
    )
}
