import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
    useCreateSponsorship,
    useIsCreatingSponsorshipForWallet,
    useSponsorshipsForCreatorQuery,
} from '~/hooks/sponsorships'
import { refetchQuery } from '~/utils'
import { isRejectionReason } from '~/modals/BaseModal'
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

    const tabQueryMap = {
        [TabOption.AllSponsorships]: allSponsorshipsQuery,
        [TabOption.MySponsorships]: mySponsorshipsQuery,
    }

    const tabQueryMapRef = useRef(tabQueryMap)

    tabQueryMapRef.current = tabQueryMap

    const navigate = useNavigate()

    useEffect(() => {
        if (!wallet) {
            navigate(routes.network.sponsorships({ tab: TabOption.AllSponsorships }))
        }
    }, [wallet, navigate])

    useEffect(() => {
        refetchQuery(tabQueryMapRef.current[selectedTab])
    }, [selectedTab])

    function refetchQueries() {
        Object.values(tabQueryMap).forEach(refetchQuery)
    }

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
                            if (!isTabOption(value)) {
                                return
                            }

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
                        onClick={async () => {
                            if (!wallet) {
                                return
                            }

                            try {
                                await createSponsorship(wallet)

                                await waitForGraphSync()

                                refetchQueries()
                            } catch (e) {
                                if (isRejectionReason(e)) {
                                    return
                                }

                                console.warn('Could not create a Sponsorship', e)
                            }
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
                            onSponsorshipFunded={refetchQueries}
                            onSponsorshipJoined={refetchQueries}
                            onStakeEdited={refetchQueries}
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
