import React, { useMemo } from 'react'
import moment from 'moment'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { Button } from '~/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import { useWalletAccount } from '~/shared/stores/wallet'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { Tooltip } from '~/components/Tooltip'
import {
    useEditSponsorshipFunding,
    useFundSponsorshipCallback,
    useIsEditingSponsorshipFunding,
    useIsFundingSponsorship,
    useIsJoiningSponsorshipAsOperator,
    useJoinSponsorshipAsOperator,
    useSponsorshipTokenInfo,
} from '~/hooks/sponsorships'
import { COLORS } from '~/shared/utils/styled'
import { abbr } from '~/utils'
import {
    ActionBarButton,
    ActionBarButtonBody,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { AboutSponsorship } from '~/components/ActionBars/AboutSponsorship'
import { Hint } from '~/components/Hint'
import { useCurrentChainId } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { useCurrentChainSymbolicName } from '~/utils/chains'
import { AbstractActionBar, Pad } from './AbstractActionBar'
import { toFloat } from '~/utils/bn'

const DayInSeconds = 60 * 60 * 24

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

    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

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
                                {abbr(sponsorship.payoutPerDay)}{' '}
                                <SponsorshipPaymentTokenName />
                                /day
                            </StatCell>
                            <StatCell label="Remaining balance">
                                {abbr(toFloat(timeCorrectedRemainingBalance, decimals))}{' '}
                                <SponsorshipPaymentTokenName />
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
                                {abbr(toFloat(sponsorship.totalStakedWei, decimals))}{' '}
                                <SponsorshipPaymentTokenName />
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
                                {abbr(
                                    toFloat(sponsorship.cumulativeSponsoring, decimals),
                                )}{' '}
                                <SponsorshipPaymentTokenName />
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
