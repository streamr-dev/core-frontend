import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent, useMemo } from 'react'
import { AboutOperator } from '~/components/ActionBars/AboutOperator'
import {
    ActionBarButton,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { Button } from '~/components/Button'
import { SponsorshipDecimals } from '~/components/Decimals'
import { Hint } from '~/components/Hint'
import { Separator } from '~/components/Separator'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import Spinner from '~/components/Spinner'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { getSelfDelegationFraction, getSpotApy } from '~/getters'
import {
    useDelegateFunds,
    useIsDelegatingFundsToOperator,
    useIsUndelegatingFundsToOperator,
    useUndelegateFunds,
} from '~/hooks/operators'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { PencilIcon } from '~/icons'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { getOperatorDelegationAmount } from '~/services/operators'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { useCurrentChainId, useCurrentChainSymbolicName } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
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

    const ownerDelegationPercentage = useMemo(
        () => getSelfDelegationFraction(operator).multipliedBy(100),
        [operator],
    )

    const isDelegatingFunds = useIsDelegatingFundsToOperator(operator.id, walletAddress)

    const delegateFunds = useDelegateFunds()

    const isUndelegatingFunds = useIsUndelegatingFundsToOperator(
        operator.id,
        walletAddress,
    )

    const undelegateFunds = useUndelegateFunds()

    const currentChainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    const canUndelegateQuery = useQuery({
        queryKey: [
            'operatorActionBar',
            currentChainId,
            operator.id,
            walletAddress?.toLowerCase(),
        ],
        async queryFn() {
            try {
                if (!operator.id || !walletAddress) {
                    return false
                }

                return (
                    (await getOperatorDelegationAmount(
                        currentChainId,
                        operator.id,
                        walletAddress,
                    )) > 0n
                )
            } catch (e) {
                console.warn(
                    'Failed to load delegation amount',
                    operator.id,
                    walletAddress,
                    e,
                )
            }

            return null
        },
    })

    const canUndelegate = !!canUndelegateQuery.data

    const { metadata } = operator

    const [delegateLabel, undelegateLabel] =
        walletAddress?.toLowerCase() === operator.owner
            ? ['Fund', 'Withdraw']
            : ['Delegate', 'Undelegate']

    return (
        <AbstractActionBar
            fallbackBackButtonUrl={R.operators(routeOptions(chainName))}
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
                                chainId: currentChainId,
                                operator,
                                wallet: walletAddress,
                                onDone: () => {
                                    canUndelegateQuery.refetch()
                                },
                            })
                        }}
                        disabled={!walletAddress || operator.contractVersion === 1} // Operator contract v1 has a bug so we need to disable delegation
                        waiting={isDelegatingFunds}
                    >
                        {delegateLabel}
                    </Button>
                    <Button
                        onClick={() => {
                            undelegateFunds({
                                chainId: currentChainId,
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
                                        {operator.valueWithoutEarnings === 0n ? (
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
                                            The amount of <SponsorshipPaymentTokenName />{' '}
                                            tokens that the Operator has staked on
                                            Sponsorships.
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
                                {operator.metadata.redundancyFactor || 1}
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
