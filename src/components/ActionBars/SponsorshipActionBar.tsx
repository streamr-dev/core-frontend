import moment from 'moment'
import React, { useMemo } from 'react'
import { AboutSponsorship } from '~/components/ActionBars/AboutSponsorship'
import {
    ActionBarButton,
    ActionBarButtonBody,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { Button } from '~/components/Button'
import { SponsorshipDecimals } from '~/components/Decimals'
import { Hint } from '~/components/Hint'
import { Separator } from '~/components/Separator'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { Tooltip } from '~/components/Tooltip'
import { DayInSeconds } from '~/consts'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import {
    useEditSponsorshipFunding,
    useFundSponsorshipCallback,
    useIsEditingSponsorshipFunding,
    useIsFundingSponsorship,
    useIsJoiningSponsorshipAsOperator,
    useJoinSponsorshipAsOperator,
} from '~/hooks/sponsorships'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS } from '~/shared/utils/styled'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { useCurrentChainId, useCurrentChainSymbolicName } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import { AbstractActionBar, Pad } from './AbstractActionBar'

export function SponsorshipActionBar({
    sponsorship,
}: {
    sponsorship: ParsedSponsorship
}) {
    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    const canEditStake = isSponsorshipFundedByOperator(sponsorship, operator)

    const { projectedInsolvencyAt, isRunning, timeCorrectedRemainingBalance } =
        sponsorship

    const isPaying = isRunning && timeCorrectedRemainingBalance > 0n

    const fundedUntil = useMemo(
        () =>
            projectedInsolvencyAt == null
                ? null
                : moment(projectedInsolvencyAt * 1000).format('D MMM YYYY'),
        [projectedInsolvencyAt],
    )

    const minimumStakingDays = sponsorship.minimumStakingPeriodSeconds / DayInSeconds

    const fundSponsorship = useFundSponsorshipCallback()

    const isFundingSponsorship = useIsFundingSponsorship(sponsorship.id, wallet)

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const isEditingSponsorshipFunding = useIsEditingSponsorshipFunding(
        sponsorship.id,
        operator?.id,
    )

    const { streamId } = sponsorship

    const chainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    return (
        <AbstractActionBar
            fallbackBackButtonUrl={R.sponsorships(routeOptions(chainName))}
            title={
                streamId ? (
                    truncateStreamName(streamId, 30)
                ) : (
                    <>Sponsorship {truncate(sponsorship.id)}</>
                )
            }
            buttons={
                <>
                    <ActionBarButtonBody
                        $background={
                            isPaying ? COLORS.activeBackground : COLORS.radioBorder
                        }
                        $color={isPaying ? COLORS.active : COLORS.primary}
                    >
                        <strong>{isPaying ? 'Paying' : 'Inactive'}</strong>
                    </ActionBarButtonBody>
                    <SimpleDropdown menu={<AboutSponsorship sponsorship={sponsorship} />}>
                        {(toggle, isOpen) => (
                            <ActionBarButton
                                active={isOpen}
                                onClick={() => void toggle((c) => !c)}
                            >
                                <ActionBarButtonInnerBody>
                                    <SvgIcon name="page" />
                                    <strong>About Sponsorship</strong>
                                </ActionBarButtonInnerBody>
                                <ActionBarButtonCaret $invert={isOpen} />
                            </ActionBarButton>
                        )}
                    </SimpleDropdown>
                    {fundedUntil && (
                        <ActionBarButtonBody>
                            <div>
                                Funded until: <strong>{fundedUntil}</strong>
                            </div>
                        </ActionBarButtonBody>
                    )}
                    <ActionBarWalletDisplay address={sponsorship.id} label="Contract" />
                </>
            }
            ctas={
                <>
                    {canEditStake ? (
                        <Button
                            disabled={!operator}
                            waiting={isEditingSponsorshipFunding}
                            onClick={async () => {
                                if (!operator) {
                                    return
                                }

                                editSponsorshipFunding({
                                    chainId,
                                    sponsorshipOrSponsorshipId: sponsorship,
                                    operator,
                                })
                            }}
                        >
                            Edit stake
                        </Button>
                    ) : (
                        <JoinAsOperatorButton
                            sponsorship={sponsorship}
                            operator={operator}
                        />
                    )}
                    <Button
                        // We decided to disable sponsoring for now as users don't know what it does.
                        // https://streamr-team.slack.com/archives/C9QB9RJ48/p1701774490263629
                        disabled={!streamId || true}
                        kind="secondary"
                        waiting={isFundingSponsorship}
                        onClick={() => {
                            fundSponsorship(chainId, sponsorship)
                        }}
                    >
                        Sponsor
                    </Button>
                </>
            }
            summaryTitle="Sponsorship summary"
            summary={
                <>
                    <Pad>
                        <StatGrid>
                            <StatCell
                                label="Payout rate"
                                tip={
                                    <Hint>
                                        <p>
                                            The rate of <SponsorshipPaymentTokenName />{' '}
                                            tokens that are distributed to Operators that
                                            have staked on this Sponsorship.
                                        </p>
                                    </Hint>
                                }
                            >
                                <SponsorshipDecimals
                                    abbr
                                    amount={sponsorship.payoutPerDay}
                                    unitSuffix="/day"
                                />
                            </StatCell>
                            <StatCell label="Remaining balance">
                                <SponsorshipDecimals
                                    abbr
                                    amount={timeCorrectedRemainingBalance}
                                />
                            </StatCell>
                            <StatCell
                                label="Total staked"
                                tip={
                                    <Hint>
                                        <p>
                                            The total amount of{' '}
                                            <SponsorshipPaymentTokenName /> tokens that
                                            has been staked on this Sponsorship
                                            by&nbsp;Operators.
                                        </p>
                                    </Hint>
                                }
                            >
                                <SponsorshipDecimals
                                    abbr
                                    amount={sponsorship.totalStakedWei}
                                />
                            </StatCell>
                        </StatGrid>
                    </Pad>
                    <Separator />
                    <Pad>
                        <StatGrid>
                            <StatCell
                                label="APY"
                                tip={
                                    <Hint>
                                        <p>
                                            The annualized yield that the staked Operators
                                            are currently earning from this Sponsorship.
                                        </p>
                                    </Hint>
                                }
                            >
                                {(sponsorship.spotAPY * 100).toFixed(0)}%
                            </StatCell>
                            <StatCell
                                label="Total sponsored"
                                tip={
                                    <Hint>
                                        <p>
                                            The cumulative amount of{' '}
                                            <SponsorshipPaymentTokenName /> tokens that
                                            Sponsors have funded this Sponsorship with.
                                        </p>
                                    </Hint>
                                }
                            >
                                <SponsorshipDecimals
                                    abbr
                                    amount={sponsorship.cumulativeSponsoring}
                                />
                            </StatCell>
                            <StatCell
                                label="Minimum stake duration"
                                tip={
                                    <Hint>
                                        <p>
                                            The minimum time that Operators must stay
                                            staked in this Sponsorship before they are
                                            able to fully unstake without a penalty. Stake
                                            reduction is always allowed and only limited
                                            by minimum&nbsp;stake.
                                        </p>
                                    </Hint>
                                }
                            >
                                {minimumStakingDays.toFixed(0)} day
                                {minimumStakingDays !== 1 && 's'}
                            </StatCell>
                        </StatGrid>
                    </Pad>
                </>
            }
        />
    )
}

function JoinAsOperatorButton({
    sponsorship,
    operator,
}: {
    sponsorship: ParsedSponsorship
    operator: ParsedOperator | null
}) {
    const walletLocked = !useWalletAccount()

    const { streamId, operatorCount, maxOperators } = sponsorship

    const isJoiningSponsorshipAsOperator = useIsJoiningSponsorshipAsOperator(
        sponsorship.id,
        operator?.id,
    )

    const chainId = useCurrentChainId()

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const maxOperatorsReached = operatorCount >= maxOperators

    const tip = walletLocked ? (
        'Unlock your wallet first'
    ) : !operator ? (
        'You need an Operator to join a Sponsorship'
    ) : !streamId ? (
        'Sponsored stream does not exist'
    ) : maxOperatorsReached ? (
        <>This Sponsorship does not allow more&nbsp;Operators</>
    ) : undefined

    if (tip) {
        return (
            <Tooltip content={tip}>
                <Button disabled>Join as operator</Button>
            </Tooltip>
        )
    }

    return (
        <Button
            waiting={isJoiningSponsorshipAsOperator}
            onClick={() => {
                if (!operator) {
                    return
                }

                joinSponsorshipAsOperator({
                    chainId,
                    sponsorship,
                    operator,
                })
            }}
        >
            Join as operator
        </Button>
    )
}
