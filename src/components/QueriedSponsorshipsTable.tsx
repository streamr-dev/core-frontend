import React, { ReactNode } from 'react'
import { UseInfiniteQueryResult } from '@tanstack/react-query'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { truncateStreamName } from '~/shared/utils/text'
import { StreamDescription } from '~/components/StreamDescription'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import { useWalletAccount } from '~/shared/stores/wallet'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import { useOperatorForWallet } from '~/hooks/operators'
import { LoadMoreButton } from '~/components/LoadMore'
import routes from '~/routes'
import {
    editSponsorshipFunding,
    fundSponsorship,
    isSponsorshipFundedByOperator,
    joinSponsorshipAsOperator,
} from '~/utils/sponsorships'
import { StreamInfoCell } from './NetworkUtils'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    onSponsorshipFunded?: () => void | Promise<void>
    onSponsorshipJoined?: () => void | Promise<void>
    onStakeEdited?: () => void | Promise<void>
    query: UseInfiniteQueryResult<{ skip: number; sponsorships: ParsedSponsorship[] }>
}

export function QueriedSponsorshipsTable({
    noDataFirstLine = 'No data',
    noDataSecondLine,
    onSponsorshipFunded,
    onSponsorshipJoined,
    onStakeEdited,
    query,
}: Props) {
    const sponsorships = query.data?.pages.map((page) => page.sponsorships).flat() || []

    const wallet = useWalletAccount()

    const operator = useOperatorForWallet(wallet)

    return (
        <>
            <ScrollTableCore
                elements={sponsorships}
                isLoading={
                    query.isLoading || query.isFetching || query.isFetchingNextPage
                }
                columns={[
                    {
                        displayName: 'Stream ID',
                        valueMapper: ({ streamId }) => (
                            <StreamInfoCell>
                                <span className="stream-id">
                                    {truncateStreamName(streamId)}
                                </span>
                                <span className="stream-description">
                                    <StreamDescription streamId={streamId} />
                                </span>
                            </StreamInfoCell>
                        ),
                        align: 'start',
                        isSticky: true,
                        key: 'streamInfo',
                    },
                    {
                        displayName: (
                            <>
                                <SponsorshipPaymentTokenName />
                                /day
                            </>
                        ),
                        valueMapper: (element) => element.payoutPerDay.toString(),
                        align: 'start',
                        isSticky: false,
                        key: 'payoutPerDay',
                    },
                    {
                        displayName: 'Operators',
                        valueMapper: (element) => element.operatorCount,
                        align: 'end',
                        isSticky: false,
                        key: 'operators',
                    },
                    {
                        displayName: 'Staked',
                        valueMapper: (element) =>
                            truncateNumber(element.totalStake.toNumber(), 'thousands'),
                        align: 'end',
                        isSticky: false,
                        key: 'staked',
                    },
                    {
                        displayName: 'APY',
                        valueMapper: ({ apy }) => `${(apy * 100).toFixed(0)}%`,
                        align: 'end',
                        isSticky: false,
                        key: 'apy',
                    },
                ]}
                actions={[
                    {
                        displayName: 'Sponsor',
                        disabled: !wallet,
                        async callback(element) {
                            if (!wallet) {
                                return
                            }

                            await fundSponsorship(
                                element.id,
                                element.payoutPerDay.toString(),
                                wallet,
                            )

                            await waitForGraphSync()

                            await onSponsorshipFunded?.()
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

                                    await editSponsorshipFunding(element, operator)

                                    await waitForGraphSync()

                                    await onStakeEdited?.()
                                },
                            }
                        }

                        return {
                            displayName: 'Join as Operator',
                            disabled: !operator,
                            async callback() {
                                if (!operator) {
                                    return
                                }

                                await joinSponsorshipAsOperator(
                                    element.id,
                                    operator,
                                    element.streamId,
                                )

                                await waitForGraphSync()

                                await onSponsorshipJoined?.()
                            },
                        }
                    },
                ]}
                noDataFirstLine={noDataFirstLine}
                noDataSecondLine={noDataSecondLine}
                linkMapper={(element) => routes.network.sponsorship({ id: element.id })}
            />
            <>
                {query.hasNextPage && (
                    <LoadMoreButton
                        disabled={query.isLoading || query.isFetching}
                        onClick={() => query.fetchNextPage()}
                        kind="primary2"
                    >
                        Load more
                    </LoadMoreButton>
                )}
            </>
        </>
    )
}
