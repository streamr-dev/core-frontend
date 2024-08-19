import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import {
    ActionBarContainer,
    FiltersBar,
    FiltersWrap,
} from '~/components/ActionBar.styles'
import { Button } from '~/components/Button'
import Layout, { LayoutColumn } from '~/components/Layout'
import NetworkPageSegment, {
    SegmentGrid,
    TitleBar,
} from '~/components/NetworkPageSegment'
import { QueriedStreamsTable } from '~/components/QueriedStreamsTable'
import {
    StreamsOrderBy,
    StreamsTabOption,
    isStreamsTabOption,
    useGlobalStreamStatsQuery,
    useStreamsQuery,
} from '~/hooks/streams'
import { useTableOrder } from '~/hooks/useTableOrder'
import SearchBar, { SearchBarWrap } from '~/shared/components/SearchBar'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { useCurrentChainFullName, useCurrentChainSymbolicName } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

export function StreamsPage() {
    const [search, setSearch] = useState('')

    const [params] = useSearchParams()

    const tabParam = params.get('tab')

    const tab = isStreamsTabOption(tabParam) ? tabParam : StreamsTabOption.All

    const navigate = useNavigate()

    const account = useWalletAccount()

    const chainName = useCurrentChainSymbolicName()

    useEffect(
        function changeToAllTabOnWalletLock() {
            if (account) {
                return
            }

            navigate(R.streams(routeOptions(chainName, { tab: StreamsTabOption.All })))
        },
        [account, navigate, chainName],
    )

    const {
        orderBy = 'peerCount',
        orderDirection = 'desc',
        setOrder,
    } = useTableOrder<StreamsOrderBy>()

    const streamsQuery = useStreamsQuery({
        orderBy,
        orderDirection,
        search,
        tab,
    })

    const globalStats = useGlobalStreamStatsQuery().data

    const globalStreamCount =
        tab === StreamsTabOption.All && globalStats ? globalStats.streamCount : undefined

    const [globalMps, globalBps] =
        tab === StreamsTabOption.All && globalStats
            ? [globalStats.messagesPerSecond, globalStats.bytesPerSecond]
            : [undefined, undefined]

    const chainFullName = useCurrentChainFullName()

    const [throughputMode, setThroughputMode] = useState<'bps' | 'mps'>('bps')

    return (
        <Layout pageTitle="Streams">
            <ActionBarContainer>
                <SearchBarWrap>
                    <SearchBar
                        value={search}
                        onChange={(value) => void setSearch(value)}
                    />
                </SearchBarWrap>
                <FiltersBar>
                    <FiltersWrap>
                        <Tabs
                            fullWidthOnMobile
                            selection={tab}
                            onSelectionChange={(id) => {
                                navigate(R.streams(routeOptions(chainName, { tab: id })))
                            }}
                        >
                            <Tab id={StreamsTabOption.All}>All streams</Tab>
                            <Tab
                                id={StreamsTabOption.Your}
                                disabled={!account}
                                title={
                                    account
                                        ? undefined
                                        : 'Connect your wallet to view your streams'
                                }
                            >
                                Your streams
                            </Tab>
                        </Tabs>
                    </FiltersWrap>
                    <CreateStreamButtonWrap>
                        <Button as={Link} to={R.stream('new', routeOptions(chainName))}>
                            Create stream
                        </Button>
                    </CreateStreamButtonWrap>
                </FiltersBar>
            </ActionBarContainer>
            <LayoutColumn>
                <SegmentGrid>
                    <NetworkPageSegment
                        foot
                        title={
                            <TitleBar
                                label={globalStreamCount}
                                aux={
                                    <>
                                        {throughputMode === 'mps' &&
                                            typeof globalMps === 'number' && (
                                                <ThroughputDisplay
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            typeof globalBps === 'number'
                                                        ) {
                                                            setThroughputMode('bps')
                                                        }
                                                    }}
                                                >
                                                    <span>Throughput</span>
                                                    <strong>
                                                        {Math.floor(globalMps)} msg/s
                                                    </strong>
                                                </ThroughputDisplay>
                                            )}
                                        {throughputMode === 'bps' &&
                                            typeof globalBps === 'number' && (
                                                <ThroughputDisplay
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            typeof globalMps === 'number'
                                                        ) {
                                                            setThroughputMode('mps')
                                                        }
                                                    }}
                                                >
                                                    <span>Throughput</span>
                                                    <strong>
                                                        {formatBytes(globalBps)}
                                                    </strong>
                                                </ThroughputDisplay>
                                            )}
                                    </>
                                }
                            >
                                {tab === StreamsTabOption.Your
                                    ? 'Your Streams'
                                    : 'All Streams'}
                            </TitleBar>
                        }
                    >
                        <QueriedStreamsTable
                            onOrderChange={setOrder}
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            query={streamsQuery}
                            noDataFirstLine={`No streams found on the ${chainFullName} chain.`}
                        />
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}

function formatBytes(value: number) {
    if (value > 1048576) {
        return `${(value / 1048576).toFixed(3)} MB/s`
    }

    if (value > 1024) {
        return `${(value / 1024).toFixed(2)} KB/s`
    }

    return `${value} B/s`
}

const LabelledThroughputDisplayMq = '(min-width: 430px)'

const VisibleThroughputDisplayMq = '(min-width: 400px)'

const ThroughputDisplay = styled.button`
    appearance: none;
    border: 0;
    align-items: center;
    background: ${COLORS.secondary};
    border-radius: 16px;
    display: none;
    font-size: 14px;
    gap: 0.4em;
    height: 32px;
    min-width: 0;
    padding: 0 12px;

    span {
        display: none;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    strong {
        white-space: nowrap;
    }

    @media ${VisibleThroughputDisplayMq} {
        display: flex;
    }

    @media ${LabelledThroughputDisplayMq} {
        span {
            display: inline;
        }
    }
`

const CreateStreamButtonWrap = styled.div`
    display: none;

    @media ${TABLET} {
        display: block;
    }
`
