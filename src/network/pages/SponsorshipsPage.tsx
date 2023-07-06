import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { toaster } from 'toasterhea'
import styles from '~/marketplace/containers/Projects/projects.pcss'
import Layout, { PageContainer } from '~/shared/components/Layout'
import { NetworkHelmet } from '~/shared/components/Helmet'
import {
    WhiteBox,
    WhiteBoxPaddingStyles,
    WhiteBoxSeparator,
} from '~/shared/components/WhiteBox'
import { LAPTOP, TABLET } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import { truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import routes from '~/routes'
import { NetworkActionBar } from '../components/ActionBars/NetworkActionBar'
import { NetworkSectionTitle } from '../components/NetworkSectionTitle'
import { StreamInfoCell } from '../components/NetworkUtils'
import { SponsorshipElement } from '../types/sponsorship'
import {
    useAllSponsorshipsQuery,
    useMySponsorshipsQuery,
} from '../hooks/useSponsorshipsList'

const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)

const PAGE_SIZE = 10

enum TabOptions {
    allSponsorships = 'allSponsorships',
    mySponsorships = 'mySponsorships',
}
export const SponsorshipsPage = () => {
    const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.allSponsorships)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const walletConnected = !!useWalletAccount()

    const allSponsorshipsQuery = useAllSponsorshipsQuery(PAGE_SIZE, searchQuery)

    const mySponsorshipsQuery = useMySponsorshipsQuery(PAGE_SIZE, searchQuery)

    const sponsorshipsQuery =
        selectedTab === TabOptions.allSponsorships
            ? allSponsorshipsQuery
            : mySponsorshipsQuery

    const sponsorships: SponsorshipElement[] =
        (sponsorshipsQuery?.data?.pages.flat() as SponsorshipElement[]) || []

    const handleSearch = useCallback(
        (searchTerm: string) => {
            setSearchQuery(searchTerm)
        },
        [setSearchQuery],
    )

    const handleTabChange = useCallback(
        (tab: string) => {
            setSelectedTab(tab as TabOptions)
        },
        [setSelectedTab],
    )

    useEffect(() => {
        if (!walletConnected && selectedTab === TabOptions.mySponsorships) {
            setSelectedTab(TabOptions.allSponsorships)
        }
    }, [walletConnected, selectedTab, setSelectedTab])

    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <NetworkHelmet title="Sponsorships" />
            <NetworkActionBar
                searchEnabled={true}
                onSearch={handleSearch}
                leftSideContent={
                    <Tabs
                        onSelectionChange={handleTabChange}
                        selection={selectedTab}
                        fullWidthOnMobile={true}
                    >
                        <Tab id={TabOptions.allSponsorships}>All sponsorships</Tab>
                        <Tab id={TabOptions.mySponsorships} disabled={!walletConnected}>
                            My sponsorships
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    <Button
                        onClick={async () => {
                            try {
                                await createSponsorshipModal.pop()
                            } catch (e) {
                                // Ignore for now.
                            }
                        }}
                    >
                        Create sponsorship
                    </Button>
                }
            />
            <PageContainer>
                <SponsorshipsTableWrap>
                    <div className="title">
                        <NetworkSectionTitle>
                            {selectedTab === TabOptions.allSponsorships ? 'All' : 'My'}{' '}
                            sponsorships
                        </NetworkSectionTitle>
                    </div>
                    <WhiteBoxSeparator />
                    <ScrollTableCore
                        elements={sponsorships}
                        isLoading={
                            sponsorshipsQuery.isLoading ||
                            sponsorshipsQuery.isFetching ||
                            sponsorshipsQuery.isFetchingNextPage
                        }
                        columns={[
                            {
                                displayName: 'Stream ID',
                                valueMapper: (element) => (
                                    <StreamInfoCell>
                                        <span className="stream-id">
                                            {truncateStreamName(element.streamId)}
                                        </span>
                                        {element.streamDescription && (
                                            <span className="stream-description">
                                                {element.streamDescription}
                                            </span>
                                        )}
                                    </StreamInfoCell>
                                ),
                                align: 'start',
                                isSticky: true,
                                key: 'streamInfo',
                            },
                            {
                                displayName: 'DATA/day',
                                valueMapper: (element) =>
                                    new BigNumber(element.DATAPerDay).toFormat(18),
                                align: 'start',
                                isSticky: false,
                                key: 'dataPerDay',
                            },
                            {
                                displayName: 'Operators',
                                valueMapper: (element) => element.operators,
                                align: 'end',
                                isSticky: false,
                                key: 'operators',
                            },
                            {
                                displayName: 'Staked',
                                valueMapper: (element) =>
                                    truncateNumber(
                                        Number(element.totalStake),
                                        'thousands',
                                    ),
                                align: 'end',
                                isSticky: false,
                                key: 'staked',
                            },
                            {
                                displayName: 'APY',
                                valueMapper: (element) => element.apy + '%',
                                align: 'end',
                                isSticky: false,
                                key: 'apy',
                            },
                        ]}
                        actions={[
                            {
                                displayName: 'Edit',
                                callback: (element) =>
                                    console.log('editing! ' + element.streamId),
                            },
                        ]}
                        noDataFirstLine={
                            selectedTab === TabOptions.allSponsorships
                                ? 'No sponsorships found.'
                                : 'You do not have any sponsorships yet.'
                        }
                        linkMapper={(element) =>
                            routes.network.sponsorship({ id: element.id })
                        }
                    />
                </SponsorshipsTableWrap>
            </PageContainer>
        </Layout>
    )
}

const SponsorshipsTableWrap = styled(WhiteBox)`
    margin-top: 40px;
    margin-bottom: 40px;
    @media (${TABLET}) {
        margin-top: 48px;
    }
    @media (${LAPTOP}) {
        margin-top: 80px;
    }

    .title {
        ${WhiteBoxPaddingStyles}
    }
`
