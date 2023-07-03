import React, { useCallback, useEffect, useState } from 'react'
import { randomHex } from 'web3-utils'
import styled from 'styled-components'
import moment from 'moment/moment'
import { toaster } from 'toasterhea'
import styles from '$mp/containers/Projects/projects.pcss'
import Layout, { PageContainer } from '$shared/components/Layout'
import { NetworkHelmet } from '$shared/components/Helmet'
import {
    WhiteBox,
    WhiteBoxPaddingStyles,
    WhiteBoxSeparator,
} from '$shared/components/WhiteBox'
import { LAPTOP, TABLET } from '$shared/utils/styled'
import { Layer } from '$utils/Layer'
import { truncateStreamName } from '$shared/utils/text'
import { truncateNumber } from '$shared/utils/truncateNumber'
import Tabs, { Tab } from '$shared/components/Tabs'
import Button from '$shared/components/Button'
import { ScrollTableCore } from '$shared/components/ScrollTable/ScrollTable'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import { NetworkActionBar } from '../components/NetworkActionBar'
import { NetworkSectionTitle } from '../components/NetworkSectionTitle'
import { StreamInfoCell } from '../components/NetworkUtils'
import { Sponsorship } from '../types/sponsorship'
import { useWalletAccount } from '$shared/stores/wallet'

const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)

enum TabOptions {
    allSponsorships = 'allSponsorships',
    mySponsorships = 'mySponsorships',
}

const hardcodedData: Sponsorship[] = [
    {
        streamId: 'jollygood.eth/my/funded/stream',
        streamDescription: 'Price, volume data feed for the DATAUSD',
        apy: 24.6,
        DATAPerDay: 1200,
        totalStake: 1500000,
        operators: 54,
        fundedUntil: moment().add(1, 'month').format('DD-mm-YYYY'),
    },
    {
        streamId: 'HSL/helsinki/trams',
        streamDescription: 'Real-time location of Helsinki trams',
        apy: 14.5,
        DATAPerDay: 4347,
        totalStake: 2300000,
        operators: 10,
        fundedUntil: moment().add(50, 'days').format('DD-mm-YYYY'),
    },
].concat(
    new Array(10).fill(null).map((_, index) => {
        return {
            streamId: randomHex(8) + '/' + Math.random(),
            streamDescription: 'Something something lorem ipsum',
            apy: Number((50 * Math.random()).toFixed(2)),
            DATAPerDay: Math.round(5000 * Math.random()),
            fundedUntil: moment()
                .add(Math.round(index * 10 * Math.random()), 'days')
                .format('DD-mm-YYYY'),
            operators: Math.round(100 * Math.random()),
            totalStake: Math.round(10000000 * Math.random()),
        }
    }),
)
export const SponsorshipsPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.allSponsorships)
    const walletConnected = !!useWalletAccount()
    const sponsorships: Sponsorship[] = hardcodedData // todo fetch from state
    const handleSearch = useCallback(
        (searchTerm: string) => {
            console.log('searching!', searchTerm)
            setIsLoading(true)
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        },
        [setIsLoading],
    )

    const handleTabChange = useCallback(
        (tab: string) => {
            console.log('selected tab!', tab)
            setIsLoading(true)
            setSelectedTab(tab as TabOptions)
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        },
        [setIsLoading],
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
                        isLoading={isLoading}
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
                                valueMapper: (element) => element.DATAPerDay,
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
                                    truncateNumber(element.totalStake, 'thousands'),
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
                        noDataFirstLine="No sponsorships found"
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
