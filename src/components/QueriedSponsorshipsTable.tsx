import React, { ReactNode } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import {
    ScrollTableCore,
    ScrollTableOrderDirection,
} from '~/shared/components/ScrollTable/ScrollTable'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { useWalletAccount } from '~/shared/stores/wallet'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import { useOperatorForWallet } from '~/hooks/operators'
import { LoadMoreButton } from '~/components/LoadMore'
import routes from '~/routes'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import {
    useEditSponsorshipFunding,
    useFundSponsorship,
    useJoinSponsorshipAsOperator,
    useSponsorshipTokenInfo,
} from '~/hooks/sponsorships'
import { isRejectionReason } from '~/modals/BaseModal'
import { FundedUntilCell, StreamIdCell } from '~/components/Table'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    onSponsorshipFunded?: () => void | Promise<void>
    onSponsorshipJoined?: () => void | Promise<void>
    onStakeEdited?: () => void | Promise<void>
    orderBy?: string
    orderDirection?: ScrollTableOrderDirection
    onOrderChange?: (columnKey: string) => void
    query: UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }>
}

export function QueriedSponsorshipsTable({
    noDataFirstLine = 'No data',
    noDataSecondLine,
    onSponsorshipFunded,
    onSponsorshipJoined,
    onStakeEdited,
    orderBy,
    orderDirection,
    onOrderChange,
    query,
}: Props) {
    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    const wallet = useWalletAccount()

    const operator = useOperatorForWallet(wallet)

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const fundSponsorship = useFundSponsorship()

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
                    {
                        displayName: (
                            <>
                                <SponsorshipPaymentTokenName />
                                /day
                            </>
                        ),
                        valueMapper: (element) =>
                            abbreviateNumber(element.payoutPerDay.toNumber()),
                        align: 'start',
                        isSticky: false,
                        key: 'payoutPerDay',
                        sortable: true,
                    },
                    {
                        displayName: 'Operators',
                        valueMapper: (element) => element.operatorCount,
                        align: 'end',
                        isSticky: false,
                        key: 'operators',
                        sortable: true,
                    },
                    {
                        displayName: 'Staked',
                        valueMapper: (element) =>
                            `${abbreviateNumber(
                                element.totalStake.toNumber(),
                            )} ${tokenSymbol}`,
                        align: 'end',
                        isSticky: false,
                        key: 'staked',
                        sortable: true,
                    },
                    {
                        displayName: 'APY',
                        valueMapper: ({ apy }) => `${(apy * 100).toFixed(0)}%`,
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
                        disabled: ({ streamId }) => !streamId || !wallet,
                        async callback(element) {
                            if (!wallet) {
                                return
                            }

                            try {
                                await fundSponsorship({
                                    sponsorship: element,
                                    wallet,
                                })

                                await waitForGraphSync()

                                await onSponsorshipFunded?.()
                            } catch (e) {
                                if (isRejectionReason(e)) {
                                    return
                                }

                                console.warn('Could not fund a Sponsorship', e)
                            }
                        },
                    },
                    (element) => {
                        if (isSponsorshipFundedByOperator(element, operator)) {
                            return {
                                displayName: 'Edit stake',
                                async callback() {
                                    if (!operator) {
                                        return
                                    }

                                    try {
                                        await editSponsorshipFunding({
                                            sponsorship: element,
                                            operator,
                                        })

                                        await waitForGraphSync()

                                        await onStakeEdited?.()
                                    } catch (e) {
                                        if (isRejectionReason(e)) {
                                            return
                                        }

                                        console.warn('Could not edit a Sponsorship', e)
                                    }
                                },
                            }
                        }

                        const maxOperatorsReached =
                            element.operatorCount >= element.maxOperators

                        return {
                            displayName: 'Join as Operator',
                            disabled:
                                !element.streamId || !operator || maxOperatorsReached,
                            async callback() {
                                if (!operator) {
                                    return
                                }

                                joinSponsorshipAsOperator({
                                    sponsorship: element,
                                    operator,
                                    onJoin: onSponsorshipJoined,
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
