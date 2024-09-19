import React from 'react'
import styled from 'styled-components'
import { SponsorshipDecimals } from '~/components/Decimals'
import { Hint } from '~/components/Hint'
import { LayoutColumn } from '~/components/Layout'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { StatCell, StatGrid } from '~/components/StatGrid'
import { DayInSeconds } from '~/consts'
import { Sponsorship } from '~/parsers/Sponsorship'
import { COLORS } from '~/shared/utils/styled'

interface SponsorshipSummaryProps {
    sponsorship: Sponsorship
}

export function SponsorshipSummary({ sponsorship }: SponsorshipSummaryProps) {
    const minimumStakingDays = sponsorship.minimumStakingPeriodSeconds / DayInSeconds

    return (
        <SponsorshipSummaryRoot>
            <LayoutColumn>
                <StatGrid $desktopColumnCount={3}>
                    <StatCell
                        label="Payout rate"
                        tip={
                            <Hint>
                                <p>
                                    The rate of <SponsorshipPaymentTokenName /> tokens
                                    that are distributed to Operators that have staked on
                                    this Sponsorship.
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
                            amount={sponsorship.timeCorrectedRemainingBalanceWeiAt(
                                Date.now(),
                            )}
                        />
                    </StatCell>
                    <StatCell
                        label="Total staked"
                        tip={
                            <Hint>
                                <p>
                                    The total amount of <SponsorshipPaymentTokenName />{' '}
                                    tokens that has been staked on this Sponsorship
                                    by&nbsp;Operators.
                                </p>
                            </Hint>
                        }
                    >
                        <SponsorshipDecimals abbr amount={sponsorship.totalStakedWei} />
                    </StatCell>
                    <StatCell
                        label="APY"
                        tip={
                            <Hint>
                                <p>
                                    The annualized yield that the staked Operators are
                                    currently earning from this Sponsorship.
                                </p>
                            </Hint>
                        }
                    >
                        {(sponsorship.spotApy * 100).toFixed(0)}%
                    </StatCell>
                    <StatCell
                        label="Total sponsored"
                        tip={
                            <Hint>
                                <p>
                                    The cumulative amount of{' '}
                                    <SponsorshipPaymentTokenName /> tokens that Sponsors
                                    have funded this Sponsorship with.
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
                                    The minimum time that Operators must stay staked in
                                    this Sponsorship before they are able to fully unstake
                                    without a penalty. Stake reduction is always allowed
                                    and only limited by minimum&nbsp;stake.
                                </p>
                            </Hint>
                        }
                    >
                        {minimumStakingDays.toFixed(0)} day
                        {minimumStakingDays !== 1 && 's'}
                    </StatCell>
                </StatGrid>
            </LayoutColumn>
        </SponsorshipSummaryRoot>
    )
}

const SponsorshipSummaryRoot = styled.div`
    background: ${COLORS.Background};
    padding: 24px 0;
`
