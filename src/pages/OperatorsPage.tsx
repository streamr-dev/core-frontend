import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { Button } from '~/components/Button'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { fromAtto } from '~/marketplace/utils/math'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { LoadMoreButton } from '~/components/LoadMore'
import { getSpotApy } from '~/getters'
import {
    useAllOperatorsQuery,
    useDelegationsForWalletQuery,
    useOperatorForWalletQuery,
} from '~/hooks/operators'
import { Delegation, OrderDirection } from '~/types'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { abbr, saveOperator } from '~/utils'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { useTableOrder } from '~/hooks/useTableOrder'
import { OperatorIdCell } from '~/components/Table'
import { useCurrentChainFullName, useCurrentChainId } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { useCurrentChainSymbolicName } from '~/utils/chains'

const PAGE_SIZE = 20

enum TabOption {
    AllOperators = 'all',
    MyDelegations = 'my',
}

function isTabOption(value: unknown): value is TabOption {
    return value === TabOption.AllOperators || value === TabOption.MyDelegations
}

export const OperatorsPage = () => {
    const [params] = useSearchParams()

    const tab = params.get('tab')

    const selectedTab = isTabOption(tab) ? tab : TabOption.AllOperators

    const [searchQuery, setSearchQuery] = useState('')

    const wallet = useWalletAccount()

    const { orderBy, orderDirection, setOrder } = useTableOrder<string>({
        orderBy: 'totalValue',
        orderDirection: 'desc',
    })

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

    const chainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const operatorQuery = useOperatorForWalletQuery(wallet)

    const { data: operator = null } = operatorQuery

    const currentQuery =
        selectedTab === TabOption.AllOperators ? allOperatorsQuery : myDelegationsQuery

    const navigate = useNavigate()

    useEffect(() => {
        if (!wallet) {
            navigate(
                R.operators(
                    routeOptions(chainName, {
                        tab: TabOption.AllOperators,
                    }),
                ),
            )
        }
    }, [wallet, navigate, chainName])

    return (
        <Layout>
            <NetworkHelmet title="Operators" />
            <NetworkActionBar
                searchEnabled={true}
                onSearch={setSearchQuery}
                leftSideContent={
                    <Tabs
                        onSelectionChange={(value) => {
                            navigate(R.operators(routeOptions(chainName, { tab: value })))
                        }}
                        selection={selectedTab}
                        fullWidthOnMobile={true}
                    >
                        <Tab id={TabOption.AllOperators}>All Operators</Tab>
                        <Tab id={TabOption.MyDelegations} disabled={!wallet}>
                            My Delegations
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    operator ? (
                        <Button
                            as={Link}
                            to={R.operator(operator.id, routeOptions(chainName))}
                        >
                            View my Operator
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                saveOperator(chainId, undefined, {
                                    onDone(id, blockNumber) {
                                        navigate(
                                            R.operator(
                                                id,
                                                routeOptions(chainId, {
                                                    b: blockNumber,
                                                }),
                                            ),
                                        )
                                    },
                                })
                            }}
                            disabled={!wallet || !!operator || operatorQuery.isFetching}
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
                            <h2>
                                {selectedTab === TabOption.AllOperators ? (
                                    <>All Operators</>
                                ) : (
                                    <>My Delegations</>
                                )}
                            </h2>
                        }
                    >
                        {selectedTab === TabOption.AllOperators ? (
                            <OperatorsTable
                                query={allOperatorsQuery}
                                tokenSymbol={tokenSymbol}
                                orderBy={orderBy}
                                orderDirection={orderDirection}
                                onOrderChange={setOrder}
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

function DelegationsTable({
    query,
    tokenSymbol,
}: {
    query: UseInfiniteQueryResult<{ skip: number; elements: Delegation[] }>
    tokenSymbol: string
}) {
    // We want to hide delegations to broken operator contract version 1
    // as we cannot get rid of them otherwise
    const elements =
        query.data?.pages
            .flatMap((page) => page.elements)
            .filter((d) => d.contractVersion !== 1) || []

    const chainName = useCurrentChainSymbolicName()

    const chainFullName = useCurrentChainFullName()

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            columns={[
                {
                    displayName: 'Operator',
                    valueMapper: ({ id, metadata: { name, imageUrl } }) => (
                        <OperatorIdCell
                            operatorId={id}
                            operatorName={name}
                            imageUrl={imageUrl}
                        />
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'operatorId',
                },
                {
                    displayName: 'My delegation',
                    valueMapper: (element) => (
                        <>
                            {abbr(fromAtto(element.myShare))} {tokenSymbol}
                        </>
                    ),
                    align: 'start',
                    isSticky: false,
                    key: 'myShare',
                },
                {
                    displayName: 'Total stake',
                    valueMapper: (element) => (
                        <>
                            {abbr(fromAtto(element.valueWithoutEarnings))} {tokenSymbol}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'totalStake',
                },
                {
                    displayName: "Owner's cut",
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
            noDataFirstLine={`You have not delegated to any operator on the ${chainFullName} chain.`}
            linkMapper={(element) => R.operator(element.id, routeOptions(chainName))}
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
    orderDirection?: OrderDirection
    onOrderChange: (columnKey: string) => void
}) {
    const elements = query.data?.pages.flatMap((page) => page.elements) || []

    const chainName = useCurrentChainSymbolicName()

    const chainFullName = useCurrentChainFullName()

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            orderDirection={orderDirection}
            orderBy={orderBy}
            onOrderChange={onOrderChange}
            columns={[
                {
                    displayName: 'Operator',
                    valueMapper: ({ id, metadata: { name, imageUrl } }) => (
                        <OperatorIdCell
                            operatorId={id}
                            operatorName={name}
                            imageUrl={imageUrl}
                        />
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'operatorId',
                },
                {
                    displayName: 'Total stake',
                    valueMapper: (element) => (
                        <>
                            {abbr(fromAtto(element.valueWithoutEarnings))} {tokenSymbol}
                        </>
                    ),
                    align: 'start',
                    isSticky: false,
                    key: 'totalValue',
                    sortable: true,
                },
                {
                    displayName: 'Deployed stake',
                    valueMapper: (element) => (
                        <>
                            {abbr(fromAtto(element.totalStakeInSponsorshipsWei))}{' '}
                            {tokenSymbol}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'deployed',
                    sortable: true,
                },
                {
                    displayName: "Owner's cut",
                    valueMapper: (element) => `${element.operatorsCut}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'operatorCut',
                    sortable: true,
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
            noDataFirstLine={`No operators found on the ${chainFullName} chain.`}
            linkMapper={(element) => R.operator(element.id, routeOptions(chainName))}
        />
    )
}
