import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { toaster } from 'toasterhea'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { Layer } from '~/utils/Layer'
import Tabs, { Tab } from '~/shared/components/Tabs'
import Button from '~/shared/components/Button'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { fromAtto } from '~/marketplace/utils/math'
import { createOperator } from '~/services/operators'
import BecomeOperatorModal from '~/modals/BecomeOperatorModal'
import { truncate } from '~/shared/utils/text'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import routes from '~/routes'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { LoadMoreButton } from '~/components/LoadMore'
import { getSpotApy } from '~/getters'
import {
    useAllOperatorsQuery,
    useDelegationsForWalletQuery,
    useOperatorForWallet,
} from '~/hooks/operators'
import { Delegation } from '~/types'
import { ParsedOperator } from '~/parsers/OperatorParser'

const becomeOperatorModal = toaster(BecomeOperatorModal, Layer.Modal)

const PAGE_SIZE = 20

enum TabOption {
    AllOperators = 'AllOperators',
    MyDelegations = 'MyDelegations',
}

export const OperatorsPage = () => {
    const [selectedTab, setSelectedTab] = useState<TabOption>(TabOption.AllOperators)

    const [searchQuery, setSearchQuery] = useState('')

    const wallet = useWalletAccount()

    const allOperatorsQuery = useAllOperatorsQuery({
        batchSize: PAGE_SIZE,
        searchQuery,
    })

    const myDelegationsQuery = useDelegationsForWalletQuery({
        address: wallet,
        pageSize: PAGE_SIZE,
        searchQuery,
    })

    const operator = useOperatorForWallet(wallet)

    const currentQuery =
        selectedTab === TabOption.AllOperators ? allOperatorsQuery : myDelegationsQuery

    useEffect(() => {
        if (!wallet) {
            setSelectedTab(TabOption.AllOperators)
        }
    }, [wallet])

    return (
        <Layout>
            <NetworkHelmet title="Operators" />
            <NetworkActionBar
                searchEnabled={true}
                onSearch={setSearchQuery}
                leftSideContent={
                    <Tabs
                        onSelectionChange={(value) => {
                            if (
                                value !== TabOption.AllOperators &&
                                value !== TabOption.MyDelegations
                            ) {
                                return
                            }

                            setSelectedTab(value)
                        }}
                        selection={selectedTab}
                        fullWidthOnMobile={true}
                    >
                        <Tab id={TabOption.AllOperators}>All operators</Tab>
                        <Tab id={TabOption.MyDelegations} disabled={!wallet}>
                            My delegations
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    operator ? (
                        <Button
                            tag={Link}
                            to={routes.network.operator({
                                id: operator.id,
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
                            disabled={!wallet || !!operator}
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
                                {selectedTab === TabOption.AllOperators ? (
                                    <>All operators</>
                                ) : (
                                    <>My delegations</>
                                )}
                            </>
                        }
                    >
                        {selectedTab === TabOption.AllOperators ? (
                            <OperatorsTable query={allOperatorsQuery} />
                        ) : (
                            <DelegationsTable query={myDelegationsQuery} />
                        )}
                        {currentQuery.hasNextPage && (
                            <LoadMoreButton
                                disabled={
                                    currentQuery.isLoading || currentQuery.isFetching
                                }
                                onClick={() => currentQuery.fetchNextPage()}
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

function DelegationsTable({
    query,
}: {
    query: UseInfiniteQueryResult<{ skip: number; elements: Delegation[] }>
}) {
    const elements = query.data?.pages.flatMap((page) => page.elements) || []

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            columns={[
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
                    valueMapper: (element) => fromAtto(element.myShare).toString(),
                    align: 'start',
                    isSticky: false,
                    key: 'myShare',
                },
                {
                    displayName: 'Total stake',
                    valueMapper: (element) =>
                        fromAtto(element.valueWithoutEarnings).toString(),
                    align: 'end',
                    isSticky: false,
                    key: 'totalStake',
                },
                {
                    displayName: "Operator's cut",
                    valueMapper: (element) => `${element.operatorsCut}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'operatorsCut',
                },
                {
                    displayName: 'APY',
                    valueMapper: (element) => `${element.apy.toFixed(0)}%`,
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
            ]}
            noDataFirstLine="You have not delegated to any operator."
            linkMapper={(element) => routes.network.operator({ id: element.id })}
        />
    )
}

function OperatorsTable({
    query,
}: {
    query: UseInfiniteQueryResult<{ skip: number; elements: ParsedOperator[] }>
}) {
    const elements = query.data?.pages.flatMap((page) => page.elements) || []

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            columns={[
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
                    valueMapper: (element) =>
                        fromAtto(element.valueWithoutEarnings).toString(),
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
                    valueMapper: (element) => `${element.operatorsCut}%`,
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
            ]}
            noDataFirstLine="No operators found."
            linkMapper={(element) => routes.network.operator({ id: element.id })}
        />
    )
}
