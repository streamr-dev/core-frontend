import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { SponsorshipDecimals } from '~/components/Decimals'
import { Hint } from '~/components/Hint'
import { LayoutColumn } from '~/components/Layout'
import Spinner from '~/components/Spinner'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { StatCell, StatGrid } from '~/components/StatGrid'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { getSelfDelegationFraction, getSpotApy } from '~/getters'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { COLORS } from '~/shared/utils/styled'

interface OperatorSummaryProps {
    operator: ParsedOperator
}

export function OperatorSummary({ operator }: OperatorSummaryProps) {
    const ownerDelegationPercentage = useMemo(
        () => getSelfDelegationFraction(operator).multipliedBy(100),
        [operator],
    )

    const heartbeats = useInterceptHeartbeats(operator.id)

    const { count: liveNodeCount, isLoading: liveNodeCountIsLoading } =
        useOperatorLiveNodes(heartbeats)

    return (
        <OperatorSummaryRoot>
            <LayoutColumn>
                <StatGrid>
                    <StatCell
                        label="Total stake"
                        tip={
                            <>
                                {operator.valueWithoutEarnings === 0n ? (
                                    <Tooltip
                                        content={
                                            <p>
                                                The owner must fund the Operator with{' '}
                                                <SponsorshipPaymentTokenName /> tokens
                                                before it can be used for staking on
                                                sponsorships or receiving delegations.
                                            </p>
                                        }
                                    >
                                        <TooltipIconWrap $color="#ff5c00">
                                            <JiraFailedBuildStatusIcon label="Error" />
                                        </TooltipIconWrap>
                                    </Tooltip>
                                ) : (
                                    <Hint>
                                        <p>
                                            The total amount of{' '}
                                            <SponsorshipPaymentTokenName /> tokens that
                                            are staked on the Operator, including deployed
                                            and undeployed tokens.
                                        </p>
                                    </Hint>
                                )}
                            </>
                        }
                    >
                        <div>
                            <SponsorshipDecimals
                                abbr
                                amount={operator.valueWithoutEarnings}
                            />
                        </div>
                    </StatCell>
                    <StatCell
                        label="Deployed stake"
                        tip={
                            <Hint>
                                <p>
                                    The amount of <SponsorshipPaymentTokenName /> tokens
                                    that the Operator has staked on Sponsorships.
                                </p>
                            </Hint>
                        }
                    >
                        <SponsorshipDecimals
                            abbr
                            amount={operator.totalStakeInSponsorshipsWei}
                        />
                    </StatCell>
                    <StatCell
                        label="Owner's stake"
                        tip={
                            <Hint>
                                <p>
                                    The percentage of stake supplied from the owner of the
                                    Operator.
                                </p>
                            </Hint>
                        }
                    >
                        {ownerDelegationPercentage.toFixed(0)}%
                    </StatCell>
                    <StatCell
                        label="Node redundancy"
                        tip={
                            <Hint>
                                <p>
                                    The amount of duplicated work when running a fleet of
                                    multiple nodes.
                                </p>
                                <p>
                                    Doing redundant work protects against slashing in case
                                    some of your nodes experience failures. For example,
                                </p>
                                <ul>
                                    <li>
                                        <strong>A Redundancy Factor of 1</strong> means
                                        that no duplication of work occurs (the feature is
                                        off),
                                    </li>
                                    <li>
                                        <strong>A Redundancy Factor of 2</strong> means
                                        that each stream assignment will be worked on by 2
                                        nodes in the fleet.
                                    </li>
                                </ul>
                            </Hint>
                        }
                    >
                        {operator.metadata.redundancyFactor || 1}
                    </StatCell>
                    <StatCell
                        label="Owner's cut"
                        tip={
                            <Hint>
                                <p>
                                    The fee that the owner of the Operator takes from all
                                    earnings.
                                </p>
                                <p>
                                    The remaining earnings are distributed among all
                                    stakeholders in the Operator, which includes
                                    delegators and the owner, in proportion to the size of
                                    their respective stakes.
                                </p>
                            </Hint>
                        }
                    >
                        {operator.operatorsCut}%
                    </StatCell>
                    <StatCell
                        label="Spot APY"
                        tip={
                            <Hint>
                                <p>
                                    The annualized yield that this Operator is earning
                                    right now, calculated from the&nbsp;present payout
                                    rates of the Sponsorships the Operator is
                                    currently&nbsp;staked in.
                                </p>
                            </Hint>
                        }
                    >
                        {(getSpotApy(operator) * 100).toFixed(0)}%
                    </StatCell>
                    <StatCell
                        label="Cumulative earnings"
                        tip={
                            <Hint>
                                <p>
                                    The total earnings that this Operator has accumulated
                                    over its whole&nbsp;lifetime.
                                </p>
                            </Hint>
                        }
                    >
                        <SponsorshipDecimals
                            abbr
                            amount={
                                operator.cumulativeProfitsWei +
                                operator.cumulativeOperatorsCutWei
                            }
                        />
                    </StatCell>
                    <StatCell
                        label="Live nodes"
                        tip={
                            <Hint>
                                <p>
                                    The number of online nodes detected that are doing
                                    work for this Operator.
                                </p>
                            </Hint>
                        }
                    >
                        {liveNodeCountIsLoading ? (
                            <Spinner color="blue" />
                        ) : (
                            liveNodeCount.toString()
                        )}
                    </StatCell>
                </StatGrid>
            </LayoutColumn>
        </OperatorSummaryRoot>
    )
}

const OperatorSummaryRoot = styled.div`
    background: ${COLORS.Background};
    padding: 24px 0;
`
