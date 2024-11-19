import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import { Button } from '~/components/Button'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import {
    SponsorshipFilterButton,
    SponsorshipFilters,
    defaultFilters,
} from '~/components/SponsorshipFilterButton'
import {
    useAllSponsorshipsQuery,
    useCreateSponsorship,
    useIsCreatingSponsorshipForWallet,
    useSponsorshipsForCreatorQuery,
} from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useWalletAccount, useIsWalletLoading } from '~/shared/stores/wallet'
import {
    useCurrentChainFullName,
    useCurrentChainId,
    useCurrentChainSymbolicName,
} from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { useUrlParams } from '~/hooks/useUrlParams'

enum TabOption {
    AllSponsorships = 'all',
    MySponsorships = 'my',
}

const PAGE_SIZE = 20
const DEFAULT_ORDER_BY = 'remainingWei'
const DEFAULT_ORDER_DIRECTION = 'desc'
const DEFAULT_TAB = TabOption.AllSponsorships

function isTabOption(value: unknown): value is TabOption {
    return value === TabOption.AllSponsorships || value === TabOption.MySponsorships
}

export const SponsorshipsPage = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const [filters, setFilters] = useState<SponsorshipFilters>(defaultFilters)

    const wallet = useWalletAccount()
    const isWalletLoading = useIsWalletLoading()

    const { orderBy, orderDirection, setOrder } = useTableOrder<string>({
        orderBy: DEFAULT_ORDER_BY,
        orderDirection: DEFAULT_ORDER_DIRECTION,
    })

    const [params] = useSearchParams()
    const tab = params.get('tab')
    const selectedTab = isTabOption(tab) ? tab : DEFAULT_TAB

    useUrlParams([
        {
            param: 'tab',
            value: selectedTab,
            defaultValue: DEFAULT_TAB,
        },
        {
            param: 'orderBy',
            value: orderBy,
            defaultValue: DEFAULT_ORDER_BY,
        },
        {
            param: 'orderDir',
            value: orderDirection,
            defaultValue: DEFAULT_ORDER_DIRECTION,
        },
    ])

    const allSponsorshipsQuery = useAllSponsorshipsQuery({
        pageSize: PAGE_SIZE,
        searchQuery,
        orderBy,
        orderDirection,
        filters,
    })

    const mySponsorshipsQuery = useSponsorshipsForCreatorQuery(wallet, {
        pageSize: PAGE_SIZE,
        searchQuery,
        orderBy,
        orderDirection,
        filters,
    })

    const navigate = useNavigate()

    const chainName = useCurrentChainSymbolicName()

    useEffect(() => {
        if (!wallet && !isWalletLoading) {
            navigate(
                R.sponsorships(
                    routeOptions(chainName, {
                        tab: TabOption.AllSponsorships,
                    }),
                ),
            )
        }
    }, [wallet, navigate, chainName, isWalletLoading])

    const createSponsorship = useCreateSponsorship()

    const isCreatingSponsorship = useIsCreatingSponsorshipForWallet(wallet)

    const chainId = useCurrentChainId()

    const chainFullName = useCurrentChainFullName()

    return (
        <Layout>
            <NetworkHelmet title="Sponsorships" />
            <NetworkActionBar
                searchEnabled
                onSearch={setSearchQuery}
                leftSideContent={
                    <Tabs
                        onSelectionChange={(value) => {
                            navigate(
                                R.sponsorships(routeOptions(chainName, { tab: value })),
                            )
                        }}
                        selection={selectedTab}
                        fullWidthOnMobile
                    >
                        <Tab id={TabOption.AllSponsorships}>All sponsorships</Tab>
                        <Tab id={TabOption.MySponsorships} disabled={!wallet}>
                            My sponsorships
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    <Button
                        waiting={isCreatingSponsorship}
                        onClick={() => {
                            createSponsorship(chainId, wallet, {
                                onDone(id, blockNumber) {
                                    navigate(
                                        R.sponsorship(
                                            id,
                                            routeOptions(chainId, {
                                                b: blockNumber,
                                            }),
                                        ),
                                    )
                                },
                            })
                        }}
                        disabled={!wallet}
                    >
                        Create sponsorship
                    </Button>
                }
            />
            <LayoutColumn>
                <SegmentGrid>
                    <NetworkPageSegment
                        foot
                        title={
                            <Title>
                                <h2>
                                    {selectedTab === TabOption.AllSponsorships ? (
                                        <>All sponsorships</>
                                    ) : (
                                        <>My sponsorships</>
                                    )}
                                </h2>
                                <SponsorshipFilterButton
                                    filter={filters}
                                    onFilterChange={setFilters}
                                />
                            </Title>
                        }
                    >
                        <QueriedSponsorshipsTable
                            query={
                                selectedTab === TabOption.AllSponsorships
                                    ? allSponsorshipsQuery
                                    : mySponsorshipsQuery
                            }
                            noDataFirstLine={
                                selectedTab === TabOption.AllSponsorships
                                    ? `No sponsorships found on the ${chainFullName} chain.`
                                    : `You do not have any sponsorships on the ${chainFullName} chain yet.`
                            }
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            onOrderChange={setOrder}
                        />
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}

const Title = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`
