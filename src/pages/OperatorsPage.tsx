import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { toaster } from 'toasterhea'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { Layer } from '~/utils/Layer'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import {
    ScrollTableColumnDef,
    ScrollTableCore,
} from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { fromAtto } from '~/marketplace/utils/math'
import { createOperator } from '~/services/operators'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import { truncate } from '~/shared/utils/text'
import { useMyOperator } from '~/hooks/useMyOperator'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import routes from '~/routes'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import { useAllOperatorsQuery, useDelegatedOperatorsQuery } from '~/hooks/useOperatorList'
import { OperatorElement } from '~/types/operator'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { LoadMoreButton } from '~/components/LoadMore'
import { getDelegatedAmountForWallet, getSpotApy } from '~/getters'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)

const PAGE_SIZE = 20

enum TabOptions {
    allOperators = 'allOperators',
    myDelegations = 'myDelegations',
}

const getAllOperatorColumns = (): ScrollTableColumnDef<OperatorElement>[] => [
    {
        displayName: 'Operator Name',
        valueMapper: (element) => (
            <OperatorNameCell>
                {element.metadata?.imageUrl ? (
                    <HubImageAvatar
                        src={element.metadata.imageUrl}
                        alt={element.metadata.imageUrl || element.id}
                    />
                ) : (
                    <HubAvatar id={element.id} />
                )}
                <span>{element.metadata?.name || truncate(element.id)}</span>
            </OperatorNameCell>
        ),
        align: 'start',
        isSticky: true,
        key: 'operatorId',
    },
    {
        displayName: 'Total value',
        valueMapper: (element) => fromAtto(element.valueWithoutEarnings).toString(),
        align: 'start',
        isSticky: false,
        key: 'totalValue',
    },
    {
        displayName: 'Deployed',
        valueMapper: (element) =>
            fromAtto(element.totalStakeInSponsorshipsWei).toString(),
        align: 'end',
        isSticky: false,
        key: 'deployed',
    },
    {
        displayName: "Operator's cut",
        valueMapper: (element) => `${element.operatorsCutFraction}%`,
        align: 'end',
        isSticky: false,
        key: 'operatorCut',
    },
    {
        displayName: 'APY',
        valueMapper: (element) => `${getSpotApy(element).toFixed(0)}%`,
        align: 'end',
        isSticky: false,
        key: 'apy',
    },
    {
        displayName: 'Sponsorships',
        valueMapper: (element) => element.stakes.length,
        align: 'end',
        isSticky: false,
        key: 'sponshorshipCount',
    },
]

const getMyDelegationsColumns = (
    myWalletAddress: string,
): ScrollTableColumnDef<OperatorElement>[] => [
    {
        displayName: 'Operator Name',
        valueMapper: (element) => (
            <OperatorNameCell>
                {element.metadata?.imageUrl ? (
                    <HubImageAvatar
                        src={element.metadata.imageUrl}
                        alt={element.metadata.imageUrl || element.id}
                    />
                ) : (
                    <HubAvatar id={element.id} />
                )}
                <span>{element.metadata?.name || truncate(element.id)}</span>
            </OperatorNameCell>
        ),
        align: 'start',
        isSticky: true,
        key: 'operatorId',
    },
    {
        displayName: 'My share',
        valueMapper: (element) =>
            fromAtto(getDelegatedAmountForWallet(myWalletAddress, element)).toString(),
        align: 'start',
        isSticky: false,
        key: 'myShare',
    },
    {
        displayName: 'Total stake',
        valueMapper: (element) => fromAtto(element.valueWithoutEarnings).toString(),
        align: 'end',
        isSticky: false,
        key: 'totalStake',
    },
    {
        displayName: "Operator's cut",
        valueMapper: (element) => `${element.operatorsCutFraction}%`,
        align: 'end',
        isSticky: false,
        key: 'operatorsCut',
    },
    {
        displayName: 'APY',
        valueMapper: (element) => `${getSpotApy(element).toFixed(0)}%`,
        align: 'end',
        isSticky: false,
        key: 'apy',
    },
    {
        displayName: 'Sponsorships',
        valueMapper: (element) => element.stakes.length,
        align: 'end',
        isSticky: false,
        key: 'sponsorships',
    },
]

export const OperatorsPage = () => {
    const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.allOperators)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const wallet = useWalletAccount()
    const walletConnected = !!wallet

    const allOperatorsQuery = useAllOperatorsQuery(PAGE_SIZE, searchQuery)
    const myDelegationsQuery = useDelegatedOperatorsQuery(PAGE_SIZE, wallet, searchQuery)
    const myOperatorQuery = useMyOperator(wallet || '')

    const isOperatorCreated = !!myOperatorQuery.data?.id

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
        <Layout>
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
                        <Button
                            tag={Link}
                            to={routes.network.operator({
                                id: myOperatorQuery.data?.id,
                            })}
                        >
                            View my Operator
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                try {
                                    await becomeOperatorModal.pop({
                                        onSubmit: createOperator,
                                    })
                                    await waitForGraphSync()
                                    await allOperatorsQuery.refetch()
                                    await myDelegationsQuery.refetch()
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
            <LayoutColumn>
                <SegmentGrid>
                    <NetworkPageSegment
                        foot
                        title={
                            <>
                                {selectedTab === TabOptions.allOperators ? (
                                    <>All operators</>
                                ) : (
                                    <>My delegations</>
                                )}
                            </>
                        }
                    >
                        <ScrollTableCore
                            elements={operators}
                            isLoading={
                                operatorsQuery.isLoading ||
                                operatorsQuery.isFetching ||
                                operatorsQuery.isFetchingNextPage
                            }
                            columns={
                                selectedTab === TabOptions.allOperators
                                    ? getAllOperatorColumns()
                                    : getMyDelegationsColumns(wallet || '')
                            }
                            noDataFirstLine={
                                selectedTab === TabOptions.allOperators
                                    ? 'No operators found.'
                                    : 'You have not delegated to any operator.'
                            }
                            linkMapper={(element) =>
                                routes.network.operator({ id: element.id })
                            }
                        />
                        {operatorsQuery.hasNextPage && (
                            <LoadMoreButton
                                disabled={
                                    operatorsQuery.isLoading || operatorsQuery.isFetching
                                }
                                onClick={() => operatorsQuery.fetchNextPage()}
                                kind="primary2"
                            >
                                Load more
                            </LoadMoreButton>
                        )}
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}

const OperatorNameCell = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
`
