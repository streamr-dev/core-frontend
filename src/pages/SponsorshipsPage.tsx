import React, { useEffect, useRef, useState } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import { useWalletAccount } from '~/shared/stores/wallet'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import {
    useAllSponsorshipsQuery,
    useSponsorshipsForCreatorQuery,
} from '~/hooks/sponsorships'
import { createSponsorship } from '~/utils/sponsorships'
import { refetchQuery } from '~/utils'

const PAGE_SIZE = 20

enum TabOption {
    AllSponsorships = 'AllSponsorships',
    MySponsorships = 'MySponsorships',
}

export const SponsorshipsPage = () => {
    const [selectedTab, setSelectedTab] = useState<TabOption>(TabOption.AllSponsorships)

    const [searchQuery, setSearchQuery] = useState('')

    const wallet = useWalletAccount()

    const allSponsorshipsQuery = useAllSponsorshipsQuery({
        pageSize: PAGE_SIZE,
        streamId: searchQuery,
    })

    const mySponsorshipsQuery = useSponsorshipsForCreatorQuery(wallet, {
        pageSize: PAGE_SIZE,
        streamId: searchQuery,
    })

    const tabQueryMap = {
        [TabOption.AllSponsorships]: allSponsorshipsQuery,
        [TabOption.MySponsorships]: mySponsorshipsQuery,
    }

    const tabQueryMapRef = useRef(tabQueryMap)

    tabQueryMapRef.current = tabQueryMap

    useEffect(() => {
        if (!wallet) {
            setSelectedTab(TabOption.AllSponsorships)
        }
    }, [wallet, selectedTab])

    useEffect(() => {
        refetchQuery(tabQueryMapRef.current[selectedTab])
    }, [selectedTab])

    function refetchQueries() {
        Object.values(tabQueryMap).forEach(refetchQuery)
    }

    return (
        <Layout>
            <NetworkHelmet title="Sponsorships" />
            <NetworkActionBar
                searchEnabled
                onSearch={setSearchQuery}
                leftSideContent={
                    <Tabs
                        onSelectionChange={(value) => {
                            if (
                                value !== TabOption.AllSponsorships &&
                                value !== TabOption.MySponsorships
                            ) {
                                return
                            }

                            setSelectedTab(value)
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
                        onClick={async () => {
                            if (!wallet) {
                                return
                            }

                            await createSponsorship(wallet)

                            await waitForGraphSync()

                            refetchQueries()
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
                            <>
                                {selectedTab === TabOption.AllSponsorships ? (
                                    <>All sponsorships</>
                                ) : (
                                    <>My sponsorships</>
                                )}
                            </>
                        }
                    >
                        <QueriedSponsorshipsTable
                            query={
                                selectedTab === TabOption.AllSponsorships
                                    ? allSponsorshipsQuery
                                    : mySponsorshipsQuery
                            }
                            onSponsorshipFunded={refetchQueries}
                            onSponsorshipJoined={refetchQueries}
                            onStakeEdited={refetchQueries}
                            noDataFirstLine={
                                selectedTab === TabOption.AllSponsorships
                                    ? 'No sponsorships found.'
                                    : 'You do not have any sponsorships yet.'
                            }
                        />
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}
