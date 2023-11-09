import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import { useWalletAccount } from '~/shared/stores/wallet'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import {
    useAllSponsorshipsQuery,
    useCreateSponsorship,
    useIsCreatingSponsorshipForWallet,
    useSponsorshipsForCreatorQuery,
} from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'
import routes from '~/routes'

const PAGE_SIZE = 20

enum TabOption {
    AllSponsorships = 'all',
    MySponsorships = 'my',
}

function isTabOption(value: unknown): value is TabOption {
    return value === TabOption.AllSponsorships || value === TabOption.MySponsorships
}

export const SponsorshipsPage = () => {
    const [params] = useSearchParams()

    const tab = params.get('tab')

    const selectedTab = isTabOption(tab) ? tab : TabOption.AllSponsorships

    const [searchQuery, setSearchQuery] = useState('')

    const wallet = useWalletAccount()

    const { orderBy, orderDirection, handleOrderChange } = useTableOrder()

    const allSponsorshipsQuery = useAllSponsorshipsQuery({
        pageSize: PAGE_SIZE,
        streamId: searchQuery,
        orderBy,
        orderDirection,
    })

    const mySponsorshipsQuery = useSponsorshipsForCreatorQuery(wallet, {
        pageSize: PAGE_SIZE,
        streamId: searchQuery,
        orderBy,
        orderDirection,
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (!wallet) {
            navigate(routes.network.sponsorships({ tab: TabOption.AllSponsorships }))
        }
    }, [wallet, navigate])

    const createSponsorship = useCreateSponsorship()

    const isCreatingSponsorship = useIsCreatingSponsorshipForWallet(wallet)

    return (
        <Layout>
            <NetworkHelmet title="Sponsorships" />
            <NetworkActionBar
                searchEnabled
                onSearch={setSearchQuery}
                leftSideContent={
                    <Tabs
                        onSelectionChange={(value) => {
                            navigate(routes.network.sponsorships({ tab: value }))
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
                            createSponsorship(wallet)
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
                            <h2>
                                {selectedTab === TabOption.AllSponsorships ? (
                                    <>All sponsorships</>
                                ) : (
                                    <>My sponsorships</>
                                )}
                            </h2>
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
                                    ? 'No sponsorships found.'
                                    : 'You do not have any sponsorships yet.'
                            }
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            onOrderChange={handleOrderChange}
                        />
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}
