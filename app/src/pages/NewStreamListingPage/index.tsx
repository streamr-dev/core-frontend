import React, { useCallback, useEffect, useState } from 'react'
import type { Stream } from 'streamr-client'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import Layout from '$shared/components/Layout'
import SearchBar from '$shared/components/SearchBar'
import Tabs from '$shared/components/Tabs'
import useInterrupt from '$shared/hooks/useInterrupt'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import InterruptionError from '$shared/errors/InterruptionError'
import { isAuthenticated } from '$shared/modules/user/selectors'
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

const BATCH_SIZE = 1

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
    const [hasMore, setHasMore] = useState<boolean>(false)
    const isUserAuthenticated = useSelector(isAuthenticated)

    const itp = useInterrupt()
    const fetchStreams = useFetchStreams()

    const fetch = useCallback(async () => {
        const { requireUninterrupted } = itp(search)

        try {
            const allowPublic = streamsSelection === StreamSelection.ALL
            const [newStreams, hasMoreResults, isFirstBatch] = await fetchStreams(search, {
                batchSize: BATCH_SIZE,
                allowPublic,
                onlyCurrentUser: streamsSelection === StreamSelection.YOUR,
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
                        loadMore={fetch}
                        hasMoreResults={hasMore}
                    />
                </TableContainer>
            </Container>
        </Layout>
    )
}

export default NewStreamListingPage
