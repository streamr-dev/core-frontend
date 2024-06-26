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
import { Route as R, routeOptions } from '~/utils/routes'
import SearchBar, { SearchBarWrap } from '~/shared/components/SearchBar'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { useCurrentChainFullName, useCurrentChainSymbolicName } from '~/utils/chains'

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

    const globalMps =
        tab === StreamsTabOption.All && globalStats
            ? globalStats.messagesPerSecond
            : undefined

    const chainFullName = useCurrentChainFullName()

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
                                    globalMps != null && (
                                        <MessagesPerSecondDisplay>
                                            Total msg/s{' '}
                                            <strong>{Math.floor(globalMps)}</strong>
                                        </MessagesPerSecondDisplay>
                                    )
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

const MessagesPerSecondDisplay = styled.div`
    align-items: center;
    background: ${COLORS.secondary};
    border-radius: 16px;
    display: flex;
    font-size: 14px;
    gap: 4px;
    height: 32px;
    padding: 0 12px;
`

const CreateStreamButtonWrap = styled.div`
    display: none;

    @media ${TABLET} {
        display: block;
    }
`
