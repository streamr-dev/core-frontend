import React, { FunctionComponent, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import Button from '~/shared/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import routes from '~/routes'
import { fromAtto } from '~/marketplace/utils/math'
import { useWalletAccount } from '~/shared/stores/wallet'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import Spinner from '~/components/Spinner'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { getSelfDelegationFraction, getSpotApy } from '~/getters'
import { ParsedOperator } from '~/parsers/OperatorParser'
import {
    useDelegateFunds,
    useIsDelegatingFundsToOperator,
    useIsUndelegatingFundsToOperator,
    useUndelegateFunds,
} from '~/hooks/operators'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { getOperatorDelegationAmount } from '~/services/operators'
import { PencilIcon } from '~/icons'
import { abbr } from '~/utils'
import {
    ActionBarButton,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { AboutOperator } from '~/components/ActionBars/AboutOperator'
import { Hint } from '~/components/Hint'
import { SponsorshipPaymentTokenName } from '../SponsorshipPaymentTokenName'
import { OperatorAvatar } from '../avatars'
import { AbstractActionBar, Pad } from './AbstractActionBar'

export const OperatorActionBar: FunctionComponent<{
    operator: ParsedOperator
    handleEdit: (operator: ParsedOperator) => void
}> = ({ operator, handleEdit }) => {
    const heartbeats = useInterceptHeartbeats(operator.id)

    const { count: liveNodeCount, isLoading: liveNodeCountIsLoading } =
        useOperatorLiveNodes(heartbeats)

    const walletAddress = useWalletAccount()

    const canEdit = !!walletAddress && walletAddress == operator.owner

    const ownerDelegationPercentage = useMemo(() => {
        return getSelfDelegationFraction(operator).multipliedBy(100)
    }, [operator])

    const isDelegatingFunds = useIsDelegatingFundsToOperator(operator.id, walletAddress)

    const delegateFunds = useDelegateFunds()

    const isUndelegatingFunds = useIsUndelegatingFundsToOperator(
        operator.id,
        walletAddress,
    )

    const undelegateFunds = useUndelegateFunds()

    const { data: canUndelegate = false } = useQuery({
        queryKey: [operator.id, walletAddress?.toLowerCase()],
        async queryFn() {
            try {
                if (!operator.id || !walletAddress) {
                    return false
                }

                return (
                    await getOperatorDelegationAmount(operator.id, walletAddress)
                ).isGreaterThan(0)
            } catch (e) {
                console.warn(
                    'Failed to load delegation amount',
                    operator.id,
                    walletAddress,
                    e,
                )
            }
        },
    })

    const { metadata } = operator

    const [delegateLabel, undelegateLabel] =
        walletAddress?.toLowerCase() === operator.owner
            ? ['Fund', 'Withdraw']
            : ['Delegate', 'Undelegate']

    return (
        <AbstractActionBar
            fallbackBackButtonUrl={routes.network.operators()}
            title={
                <>
                    <OperatorAvatar
                        imageUrl={metadata.imageUrl}
                        operatorId={operator.id}
                    />
                    <span>{metadata.name || operator.id}</span>
                </>
            }
            buttons={
                <>
                    {canEdit && (
                        <ActionBarButton onClick={() => void handleEdit(operator)}>
                            <strong>Edit Operator</strong>
                            <PencilIcon />
                        </ActionBarButton>
                    )}
                    <SimpleDropdown menu={<AboutOperator operator={operator} />}>
                        {(toggle, isOpen) => (
                            <ActionBarButton
                                active={isOpen}
                                onClick={() => void toggle((c) => !c)}
                            >
                                <ActionBarButtonInnerBody>
                                    <SvgIcon name="page" />
                                    <strong>About Operator</strong>
                                </ActionBarButtonInnerBody>
                                <ActionBarButtonCaret $invert={isOpen} />
                            </ActionBarButton>
                        )}
                    </SimpleDropdown>
                    <ActionBarWalletDisplay address={operator.id} label="Operator" />
                </>
            }
            ctas={
                <>
                    <Button
                        onClick={() => {
                            delegateFunds({
                                operator,
                                wallet: walletAddress,
                            })
                        }}
                        disabled={!walletAddress}
                        waiting={isDelegatingFunds}
                    >
                        {delegateLabel}
                    </Button>
                    <Button
                        onClick={() => {
                            undelegateFunds({
                                operator,
                                wallet: walletAddress,
                            })
                        }}
                        disabled={!canUndelegate}
                        waiting={isUndelegatingFunds}
                    >
                        {undelegateLabel}
                    </Button>
                </>
            }
            summaryTitle="Operator summary"
            summary={
                <>
                    <Pad>
                        <StatGrid>
                            <StatCell
                                label="Total stake"
                                tip={
                                    <>
                                        {operator.valueWithoutEarnings.isZero() ? (
                                            <Tooltip
                                                content={
                                                    <p>
                                                        The owner must fund the Operator
                                                        with{' '}
                                                        <SponsorshipPaymentTokenName />{' '}
                                                        tokens before it can be used for
                                                        staking on sponsorships or
                                                        receiving delegations.
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
                                                    <SponsorshipPaymentTokenName /> tokens
                                                    that are staked on the Operator,
                                                    including deployed and undeployed
                                                    tokens.
                                                </p>
                                            </Hint>
                                        )}
                                    </>
                                }
                            >
                                <div>
                                    {abbr(fromAtto(operator.valueWithoutEarnings))}{' '}
                                    <SponsorshipPaymentTokenName />
                                </div>
                            </StatCell>
                            <StatCell
                                label="Deployed stake"
                                tip={
                                    <Hint>
                                        <p>
                                            The amount of <SponsorshipPaymentTokenName />{' '}
                                            tokens that the Operator has staked on
                                            Sponsorships.
                                        </p>
                                    </Hint>
                                }
                            >
                                {abbr(fromAtto(operator.totalStakeInSponsorshipsWei))}{' '}
                                <SponsorshipPaymentTokenName />
                            </StatCell>
                            <StatCell
                                label="Owner's stake"
                                tip={
                                    <Hint>
                                        <p>
                                            The percentage of stake supplied from the
                                            owner of the Operator.
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
                                            The amount of duplicated work when running a
                                            fleet of multiple nodes.
                                        </p>
                                        <p>
                                            Doing redundant work protects against slashing
                                            in case some of your nodes experience
                                            failures. For example,
                                        </p>
                                        <ul>
                                            <li>
                                                <strong>A Redundancy Factor of 1</strong>{' '}
                                                means that no duplication of work occurs
                                                (the feature is off),
                                            </li>
                                            <li>
                                                <strong>A Redundancy Factor of 2</strong>{' '}
                                                means that each stream assignment will be
                                                worked on by 2 nodes in the fleet.
                                            </li>
                                        </ul>
                                    </Hint>
                                }
                            >
                                {operator.metadata?.redundancyFactor?.toString() || '1'}
                            </StatCell>
                        </StatGrid>
                    </Pad>
                    <Separator />
                    <Pad>
                        <StatGrid>
                            <StatCell
                                label="Owner's cut"
                                tip={
                                    <Hint>
                                        <p>
                                            The fee that the owner of the Operator takes
                                            from all earnings.
                                        </p>
                                        <p>
                                            The remaining earnings are distributed among
                                            all stakeholders in the Operator, which
                                            includes delegators and the owner, in
                                            proportion to the size of their respective
                                            stakes.
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
                                            The annualized yield that this Operator is
                                            earning right now, calculated from
                                            the&nbsp;present payout rates of the
                                            Sponsorships the Operator is
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
                                            The total earnings that this Operator has
                                            accumulated over its whole&nbsp;lifetime.
                                        </p>
                                    </Hint>
                                }
                            >
                                {abbr(
                                    fromAtto(
                                        operator.cumulativeProfitsWei.plus(
                                            operator.cumulativeOperatorsCutWei,
                                        ),
                                    ),
                                )}{' '}
                                <SponsorshipPaymentTokenName />
                            </StatCell>
                            <StatCell
                                label="Live nodes"
                                tip={
                                    <Hint>
                                        <p>
                                            The number of online nodes detected that are
                                            doing work for this Operator.
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
                    </Pad>
                </>
            }
        />
    )
}
