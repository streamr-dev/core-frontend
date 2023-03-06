import React, { useCallback, useEffect, useState } from 'react'
import type { Stream, StreamID } from 'streamr-client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import Layout from '$shared/components/Layout'
import SearchBar from '$shared/components/SearchBar'
import Tabs from '$shared/components/Tabs'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import { getStreamsFromIndexer, IndexerStream } from '$app/src/services/streams'
import {useIsAuthenticated} from "$auth/hooks/useIsAuthenticated"
import InterruptionError from '$shared/errors/InterruptionError'
import { FiltersBar, FiltersWrap, SearchBarWrap } from '$mp/components/ActionBar/actionBar.styles'

import routes from '$routes'
import StreamTable from '../../shared/components/StreamTable'

enum StreamSelection {
    ALL = 'ALL',
    YOUR = 'YOUR',
}

const streamSelectionOptions = (isUserAuthenticated: boolean) => [
    {
        label: 'All streams',
        value: StreamSelection.ALL,
    },
    {
        label: 'Your streams',
        value: StreamSelection.YOUR,
        disabled: !isUserAuthenticated,
        disabledReason: 'Connect your wallet to view your streams'
    },
]

const PAGE_SIZE = 10

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

const NewStreamListingPage: React.FC = () => {
    const [search, setSearch] = useState<string>('')
    const [streamsSelection, setStreamsSelection] = useState<StreamSelection>(StreamSelection.ALL)
    const [streams, setStreams] = useState<Array<Stream>>([])
    const [streamStats, setStreamStats] = useState<Record<StreamID, IndexerStream>>({})
    const [hasMore, setHasMore] = useState<boolean>(false)
    const isUserAuthenticated = useIsAuthenticated()

    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()

    const fetch = useCallback(async () => {
        const { requireUninterrupted } = itp(search)

        try {
            const allowPublic = streamsSelection === StreamSelection.ALL
            const [newStreams, hasMoreResults, isFirstBatch] = await fetchStreams(search, {
                batchSize: PAGE_SIZE,
                allowPublic,
                onlyCurrentUser: streamsSelection === StreamSelection.YOUR,
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
    }, [itp, search, fetchStreams, streamsSelection])

    useEffect(() => {
        fetch()
    }, [fetch, streamsSelection])

    return (
        <Layout>
            <SearchBarWrap>
                <SearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value)
                    }}
                />
            </SearchBarWrap>
            <FiltersBar>
                <FiltersWrap>
                    <Tabs
                        options={streamSelectionOptions(isUserAuthenticated)}
                        onChange={(newValue) => setStreamsSelection(StreamSelection[newValue])}
                        selectedOptionValue={streamsSelection}
                    />
                </FiltersWrap>
                <Button tag={Link} to={routes.streams.new()}>
                    Create stream
                </Button>
            </FiltersBar>
            <Container>
                <TableContainer>
                    <StreamTable
                        title={`${streamsSelection === StreamSelection.ALL ? 'All' : 'Your'} Streams`}
                        streams={streams}
                        streamStats={streamStats}
                        loadMore={fetch}
                        hasMoreResults={hasMore}
                        showGlobalStats={streamsSelection === StreamSelection.ALL}
                    />
                </TableContainer>
            </Container>
        </Layout>
    )
}

export default NewStreamListingPage
