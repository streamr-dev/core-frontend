import { UseInfiniteQueryResult } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { LoadMoreButton } from '~/components/LoadMore'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import {
    DecimalsCell,
    FundedUntilCell,
    NumberOfOperatorsCell,
    SponsorshipApyCell,
    StreamIdCell,
} from '~/components/Table'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import {
    useEditSponsorshipFunding,
    useFundSponsorshipCallback,
    useJoinSponsorshipAsOperator,
    useSponsorshipTokenInfo,
} from '~/hooks/sponsorships'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { OrderDirection } from '~/types'
import { abbr } from '~/utils'
import { toFloat } from '~/utils/bn'
import { useCurrentChainId, useCurrentChainSymbolicName } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    orderBy?: string
    orderDirection?: OrderDirection
    onOrderChange?: (columnKey: string) => void
    query: UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }>
    hideStreamId?: boolean
}

export function QueriedSponsorshipsTable({
    noDataFirstLine = 'No data',
    noDataSecondLine,
    orderBy,
    orderDirection,
    onOrderChange,
    query,
    hideStreamId = false,
}: Props) {
    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    const chainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    const fundSponsorship = useFundSponsorshipCallback()

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    return (
        <>
            <ScrollTableCore
                elements={sponsorships}
                isLoading={
                    query.isLoading || query.isFetching || query.isFetchingNextPage
                }
                orderBy={orderBy}
                orderDirection={orderDirection}
                onOrderChange={onOrderChange}
                columns={[
                    ...(hideStreamId == false
                        ? [
                              {
                                  displayName: 'Stream ID',
                                  valueMapper: ({ streamId }) => (
                                      <StreamIdCell streamId={streamId} />
                                  ),
                                  align: 'start',
                                  isSticky: true,
                                  key: 'streamInfo',
                                  sortable: true,
                              },
                          ]
                        : ([] as any)),
                    {
                        displayName: (
                            <>
                                <SponsorshipPaymentTokenName />
                                /day
                            </>
                        ),
                        valueMapper: (element) =>
                            abbr(toFloat(element.payoutPerDay, decimals)),
                        align: 'start',
                        isSticky: hideStreamId,
                        key: 'payoutPerDay',
                        sortable: true,
                    },
                    {
                        displayName: 'Funds',
                        valueMapper: (element) => (
                            <DecimalsCell
                                amount={element.timeCorrectedRemainingBalance}
                                decimals={decimals}
                            />
                        ),
                        align: 'start',
                        isSticky: false,
                        key: 'remainingWei',
                        sortable: true,
                    },
                    {
                        displayName: 'Operators',
                        valueMapper: (element) => (
                            <NumberOfOperatorsCell
                                sponsorship={element}
                                currentOperatorId={operator?.id}
                            />
                        ),
                        align: 'start',
                        isSticky: false,
                        key: 'operators',
                        sortable: true,
                    },
                    {
                        displayName: 'Staked',
                        valueMapper: (element) => (
                            <>
                                <DecimalsCell
                                    amount={element.totalStakedWei}
                                    decimals={decimals}
                                />{' '}
                                <SponsorshipPaymentTokenName />
                            </>
                        ),
                        align: 'end',
                        isSticky: false,
                        key: 'staked',
                        sortable: true,
                    },
                    {
                        displayName: 'APY',
                        valueMapper: (element) => (
                            <SponsorshipApyCell
                                spotAPY={element.spotAPY}
                                isRunning={element.isRunning}
                            />
                        ),
                        align: 'end',
                        isSticky: false,
                        key: 'apy',
                        sortable: true,
                    },
                    {
                        displayName: 'Funded until',
                        valueMapper: (element) => (
                            <FundedUntilCell
                                projectedInsolvencyAt={element.projectedInsolvencyAt}
                                remainingBalance={element.remainingBalanceWei}
                            />
                        ),
                        align: 'start',
                        isSticky: false,
                        key: 'fundedUntil',
                        sortable: true,
                    },
                ]}
                actions={[
                    {
                        displayName: 'Sponsor',
                        disabled: ({ streamId }) => !streamId,
                        callback(element) {
                            fundSponsorship(chainId, element)
                        },
                    },
                    (element) => {
                        if (isSponsorshipFundedByOperator(element, operator)) {
                            return {
                                displayName: 'Edit stake',
                                callback() {
                                    if (!operator) {
                                        return
                                    }

                                    editSponsorshipFunding({
                                        chainId,
                                        sponsorshipOrSponsorshipId: element,
                                        operator,
                                    })
                                },
                            }
                        }

                        const maxOperatorsReached =
                            element.operatorCount >= element.maxOperators

                        return {
                            displayName: 'Join as Operator',
                            disabled:
                                !element.streamId || !operator || maxOperatorsReached,
                            callback() {
                                if (!operator) {
                                    return
                                }

                                joinSponsorshipAsOperator({
                                    chainId,
                                    sponsorship: element,
                                    operator,
                                })
                            },
                        }
                    },
                ]}
                noDataFirstLine={noDataFirstLine}
                noDataSecondLine={noDataSecondLine}
                linkMapper={(element) =>
                    R.sponsorship(element.id, routeOptions(chainName))
                }
            />
            {query.hasNextPage && (
                <LoadMoreButton
                    disabled={query.isLoading || query.isFetching}
                    onClick={() => void query.fetchNextPage()}
                    kind="primary2"
                >
                    Load more
                </LoadMoreButton>
            )}
        </>
    )
}
