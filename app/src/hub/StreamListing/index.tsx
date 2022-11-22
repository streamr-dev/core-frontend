import React, { useCallback, useEffect, useState } from 'react'
import type { Stream } from 'streamr-client'
import styled from 'styled-components'

import { COLORS } from '$shared/utils/styled'
import Layout from '$shared/components/Layout'
import SearchBar from '$shared/components/SearchBar'
import Tabs from '$shared/components/Tabs'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import InterruptionError from '$shared/errors/InterruptionError'

import StreamTable from './StreamTable'

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

const TableContainer = styled.div`
    border-radius: 8px;
    background-color: white;
    margin: 60px 78px 0 78px;
`

const Heading = styled.div`
    font-size: 34px;
    line-height: 34px;
    color: ${COLORS.primary};
    padding-left: 60px;
    padding: 55px 60px;
`

const StreamListing: React.FC = () => {
    const [search, setSearch] = useState<string>('')
    const [streamsSelection, setStreamsSelection] = useState<StreamSelection>(StreamSelection.ALL)
    const [streams, setStreams] = useState<Array<Stream>>([])
    const [hasMore, setHasMore] = useState()

    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()

    const fetch = useCallback(async () => {
        const { requireUninterrupted } = itp(search)

        try {
            const allowPublic = streamsSelection === StreamSelection.ALL
            const [newStreams, hasMore2, isFirstBatch] = await fetchStreams(search, {
                batchSize: BATCH_SIZE,
                allowPublic,
            })
            requireUninterrupted()
            setHasMore(hasMore2)

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
                name='Test'
                options={streamSelectionOptions}
                onChange={(newValue) => setStreamsSelection(newValue)}
                selectedOptionValue={streamsSelection}
            />
            <TableContainer>
                <Heading>{streamsSelection === StreamSelection.ALL ? 'All' : 'Your'} Streams</Heading>
                <StreamTable
                    streams={streams}
                />
            </TableContainer>
        </Layout>
    )
}

export default StreamListing
