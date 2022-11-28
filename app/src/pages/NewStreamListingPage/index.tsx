import React, { useCallback, useEffect, useState } from 'react'
import type { Stream } from 'streamr-client'
import styled from 'styled-components'

import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'
import Layout from '$shared/components/Layout'
import SearchBar from '$shared/components/SearchBar'
import Tabs from '$shared/components/Tabs'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import InterruptionError from '$shared/errors/InterruptionError'

import StreamTable from '../../shared/components/StreamTable'

enum StreamSelection {
    ALL = 'ALL',
    YOUR = 'YOUR',
}

const streamSelectionOptions = [
    {
        label: 'All streams',
        value: StreamSelection.ALL,
    },
    {
        label: 'Your streams',
        value: StreamSelection.YOUR,
    },
]

const BATCH_SIZE = 10

const Container = styled.div`
    background-color: ${COLORS.secondary};

    padding: 24px 24px 80px 24px;

    @media ${TABLET} {
        padding: 45px 40px 90px 40px;
    }

    @media ${DESKTOP} {
        padding: 60px 78px 130px 78px;
    }
`

const TableContainer = styled.div`
    border-radius: 16px;
    background-color: white;
`

const StreamListing: React.FC = () => {
    const [search, setSearch] = useState<string>('')
    const [streamsSelection, setStreamsSelection] = useState<StreamSelection>(StreamSelection.ALL)
    const [streams, setStreams] = useState<Array<Stream>>([])
    const [hasMore, setHasMore] = useState<boolean>(false)

    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()

    const fetch = useCallback(async () => {
        const { requireUninterrupted } = itp(search)

        try {
            const allowPublic = streamsSelection === StreamSelection.ALL
            const [newStreams, hasMoreResults, isFirstBatch] = await fetchStreams(search, {
                batchSize: BATCH_SIZE,
                allowPublic,
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
    }, [itp, search, fetchStreams, streamsSelection])

    useEffect(() => {
        fetch()
    }, [fetch, streamsSelection])

    return (
        <Layout>
            <SearchBar
                value={search}
                onChange={(value) => {
                    setSearch(value)
                }}
            />
            <Tabs
                options={streamSelectionOptions}
                onChange={(newValue) => setStreamsSelection(StreamSelection[newValue])}
                selectedOptionValue={streamsSelection}
            />
            <Container>
                <TableContainer>
                    <StreamTable
                        title={`${streamsSelection === StreamSelection.ALL ? 'All' : 'Your'} Streams`}
                        streams={streams}
                        loadMore={fetch}
                        hasMoreResults={hasMore}
                    />
                </TableContainer>
            </Container>
        </Layout>
    )
}

export default StreamListing
