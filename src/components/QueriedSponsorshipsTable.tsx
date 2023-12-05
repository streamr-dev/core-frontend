import React, { ReactNode } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import {
    ScrollTableCore,
    ScrollTableOrderDirection,
} from '~/shared/components/ScrollTable/ScrollTable'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import { LoadMoreButton } from '~/components/LoadMore'
import routes from '~/routes'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import {
    useEditSponsorshipFunding,
    useFundSponsorshipCallback,
    useJoinSponsorshipAsOperator,
} from '~/hooks/sponsorships'
import { FundedUntilCell, NumberOfOperatorsCell, StreamIdCell } from '~/components/Table'
import { abbr } from '~/utils'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    orderBy?: string
    orderDirection?: ScrollTableOrderDirection
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

    const fundSponsorship = useFundSponsorshipCallback()

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const editSponsorshipFunding = useEditSponsorshipFunding()

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
                        valueMapper: (element) => abbr(element.payoutPerDay),
                        align: 'start',
                        isSticky: hideStreamId,
                        key: 'payoutPerDay',
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
                                {abbr(element.totalStake)} <SponsorshipPaymentTokenName />
                            </>
                        ),
                        align: 'end',
                        isSticky: false,
                        key: 'staked',
                        sortable: true,
                    },
                    {
                        displayName: 'APY',
                        valueMapper: ({ spotAPY }) => `${(spotAPY * 100).toFixed(0)}%`,
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
                            fundSponsorship(element)
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
                                    sponsorship: element,
                                    operator,
                                })
                            },
                        }
                    },
                ]}
                noDataFirstLine={noDataFirstLine}
                noDataSecondLine={noDataSecondLine}
                linkMapper={(element) => routes.network.sponsorship({ id: element.id })}
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
