import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
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
import { truncateNumber } from '~/shared/utils/truncateNumber'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import Footer from '~/shared/components/Layout/Footer'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { createSponsorship } from '~/services/sponsorships'
import { useOperator } from '~/hooks/useOperator'
import { calculateOperatorSpotAPY } from '~/utils/apy'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import routes from '~/routes'
import { NetworkActionBar } from '../components/ActionBars/NetworkActionBar'
import { NetworkSectionTitle } from '../components/NetworkSectionTitle'
import {
    useAllOperatorsQuery,
    useDelegatedOperatorsQuery,
} from '../hooks/useOperatorList'
import { OperatorElement } from '../types/operator'
import { fromAtto } from '~/marketplace/utils/math'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)

const PAGE_SIZE = 20

enum TabOptions {
    allOperators = 'allOperators',
    myDelegations = 'myDelegations',
}

export const OperatorsPage = () => {
    const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.allOperators)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const wallet = useWalletAccount()
    const walletConnected = !!wallet

    const allOperatorsQuery = useAllOperatorsQuery(PAGE_SIZE, searchQuery)
    const myDelegationsQuery = useDelegatedOperatorsQuery(PAGE_SIZE, wallet)
    const operatorQuery = useOperator(wallet || '')

    const isOperatorCreated = !!operatorQuery.data?.id

    const operatorsQuery =
        selectedTab === TabOptions.allOperators ? allOperatorsQuery : myDelegationsQuery

    const operators: OperatorElement[] =
        operatorsQuery.data?.pages.map((page) => page.elements).flat() || []

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
        if (!walletConnected && selectedTab === TabOptions.myDelegations) {
            setSelectedTab(TabOptions.allOperators)
        }
    }, [walletConnected, selectedTab, setSelectedTab])

    return (
        <Layout
            className={styles.projectsListPage}
            framedClassName={styles.productsFramed}
            innerClassName={styles.productsInner}
            footer={false}
        >
            <NetworkHelmet title="Operators" />
            <NetworkActionBar
                searchEnabled={true}
                onSearch={handleSearch}
                leftSideContent={
                    <Tabs
                        onSelectionChange={handleTabChange}
                        selection={selectedTab}
                        fullWidthOnMobile={true}
                    >
                        <Tab id={TabOptions.allOperators}>All operators</Tab>
                        <Tab id={TabOptions.myDelegations} disabled={!walletConnected}>
                            My delegations
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    isOperatorCreated ? (
                        <Button href={routes.network.operator({ id: wallet })}>
                            View my Operator
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                try {
                                    await becomeOperatorModal.pop()
                                    await operatorsQuery.refetch()
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                            disabled={!walletConnected || isOperatorCreated}
                        >
                            Become an Operator
                        </Button>
                    )
                }
            />
            <PageContainer>
                <OperatorsTableWrap>
                    <div className="title">
                        <NetworkSectionTitle>
                            {selectedTab === TabOptions.allOperators
                                ? 'All operators'
                                : 'My delegations'}
                        </NetworkSectionTitle>
                    </div>
                    <WhiteBoxSeparator />
                    <ScrollTableCore
                        elements={operators}
                        isLoading={
                            operatorsQuery.isLoading ||
                            operatorsQuery.isFetching ||
                            operatorsQuery.isFetchingNextPage
                        }
                        columns={[
                            {
                                displayName: 'Operator ID',
                                valueMapper: (element) => element.id,
                                align: 'start',
                                isSticky: true,
                                key: 'operatorId',
                            },
                            {
                                displayName: 'Total value',
                                valueMapper: (element) =>
                                    fromAtto(element.poolValue).toString(),
                                align: 'start',
                                isSticky: false,
                                key: 'totalValue',
                            },
                            {
                                displayName: 'Deployed',
                                valueMapper: (element) =>
                                    fromAtto(
                                        element.totalValueInSponsorshipsWei,
                                    ).toString(),
                                align: 'start',
                                isSticky: false,
                                key: 'deployed',
                            },
                            {
                                displayName: 'Operator cut',
                                valueMapper: (element) => element.exchangeRate.toString(),
                                align: 'start',
                                isSticky: false,
                                key: 'operatorCut',
                            },
                            {
                                displayName: 'APY',
                                valueMapper: (element) =>
                                    calculateOperatorSpotAPY(element).toString(),
                                align: 'start',
                                isSticky: false,
                                key: 'apy',
                            },
                            {
                                displayName: 'Sponsorships',
                                valueMapper: (element) => element.stakes.length,
                                align: 'start',
                                isSticky: false,
                                key: 'sponshorshipCount',
                            },
                        ]}
                        actions={[
                            {
                                displayName: 'Edit',
                                callback: (element) =>
                                    console.warn('editing! ' + element.id),
                            },
                        ]}
                        noDataFirstLine={
                            selectedTab === TabOptions.allOperators
                                ? 'No operators found.'
                                : 'You have not delegated to any operator.'
                        }
                        linkMapper={(element) =>
                            routes.network.operator({ id: element.id })
                        }
                    />
                </OperatorsTableWrap>
                {operatorsQuery.hasNextPage && (
                    <LoadMoreButton
                        disabled={operatorsQuery.isLoading || operatorsQuery.isFetching}
                        onClick={() => operatorsQuery.fetchNextPage()}
                        kind="primary2"
                    >
                        Load more
                    </LoadMoreButton>
                )}
            </PageContainer>
            <Footer />
        </Layout>
    )
}

const OperatorsTableWrap = styled(WhiteBox)`
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

const LoadMoreButton = styled(Button)`
    display: block;
    margin: 130px auto 80px;
`
