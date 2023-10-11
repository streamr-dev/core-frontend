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
import {
    getNextSortingParameters,
    ScrollTableCore,
    ScrollTableOrderDirection,
} from '~/shared/components/ScrollTable/ScrollTable'
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
import { refetchQuery } from '~/utils'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'

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

    const [orderBy, setOrderBy] = useState<string | undefined>(undefined)
    const [orderDirection, setOrderDirection] = useState<
        ScrollTableOrderDirection | undefined
    >(undefined)

    const allOperatorsQuery = useAllOperatorsQuery({
        batchSize: PAGE_SIZE,
        searchQuery,
        orderBy,
        orderDirection,
    })

    const myDelegationsQuery = useDelegationsForWalletQuery({
        address: wallet,
        pageSize: PAGE_SIZE,
        searchQuery,
    })

    const handleOrderChange = (columnKey: string) => {
        const newOrderSettings = getNextSortingParameters(
            orderBy,
            columnKey,
            orderDirection,
        )
        setOrderBy(newOrderSettings.orderBy)
        setOrderDirection(newOrderSettings.orderDirection)
    }

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

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

                                    refetchQuery(allOperatorsQuery)

                                    refetchQuery(myDelegationsQuery)
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
                            <OperatorsTable
                                query={allOperatorsQuery}
                                tokenSymbol={tokenSymbol}
                                orderBy={orderBy}
                                orderDirection={orderDirection}
                                onOrderChange={handleOrderChange}
                            />
                        ) : (
                            <DelegationsTable
                                query={myDelegationsQuery}
                                tokenSymbol={tokenSymbol}
                            />
                        )}
                        {currentQuery.hasNextPage && (
                            <LoadMoreButton
                                disabled={
                                    currentQuery.isLoading || currentQuery.isFetching
                                }
                                onClick={() => void currentQuery.fetchNextPage()}
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
    tokenSymbol,
}: {
    query: UseInfiniteQueryResult<{ skip: number; elements: Delegation[] }>
    tokenSymbol: string
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
                    valueMapper: (element) =>
                        `${abbreviateNumber(
                            fromAtto(element.myShare).toNumber(),
                        )} ${tokenSymbol}`,
                    align: 'start',
                    isSticky: false,
                    key: 'myShare',
                },
                {
                    displayName: 'Total stake',
                    valueMapper: (element) =>
                        `${abbreviateNumber(
                            fromAtto(element.valueWithoutEarnings).toNumber(),
                        )} ${tokenSymbol}`,
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
                    valueMapper: (element) => `${(element.apy * 100).toFixed(0)}%`,
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
    tokenSymbol,
    orderBy,
    orderDirection,
    onOrderChange,
}: {
    query: UseInfiniteQueryResult<{ skip: number; elements: ParsedOperator[] }>
    tokenSymbol: string
    orderBy?: string
    orderDirection?: ScrollTableOrderDirection
    onOrderChange: (columnKey: string) => void
}) {
    const elements = query.data?.pages.flatMap((page) => page.elements) || []

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            orderDirection={orderDirection}
            orderBy={orderBy}
            onOrderChange={onOrderChange}
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
                        `${abbreviateNumber(
                            fromAtto(element.valueWithoutEarnings).toNumber(),
                        )} ${tokenSymbol}`,
                    align: 'start',
                    isSticky: false,
                    key: 'totalValue',
                    orderingEnabled: true,
                },
                {
                    displayName: 'Deployed',
                    valueMapper: (element) =>
                        `${abbreviateNumber(
                            fromAtto(element.totalStakeInSponsorshipsWei).toNumber(),
                        )} ${tokenSymbol}`,
                    align: 'end',
                    isSticky: false,
                    key: 'deployed',
                    orderingEnabled: true,
                },
                {
                    displayName: "Operator's cut",
                    valueMapper: (element) => `${element.operatorsCut}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'operatorCut',
                    orderingEnabled: true,
                },
                {
                    displayName: 'APY',
                    valueMapper: (element) =>
                        `${(getSpotApy(element) * 100).toFixed(0)}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'apy',
                },
                {
                    displayName: 'Sponsorships',
                    valueMapper: (element) => element.stakes.length,
                    align: 'end',
                    isSticky: false,
                    key: 'sponsorshipCount',
                },
            ]}
            noDataFirstLine="No operators found."
            linkMapper={(element) => routes.network.operator({ id: element.id })}
        />
    )
}
