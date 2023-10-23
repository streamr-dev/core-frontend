import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import Button from '~/shared/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import routes from '~/routes'
import { fromAtto } from '~/marketplace/utils/math'
import { useWalletAccount } from '~/shared/stores/wallet'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import Spinner from '~/shared/components/Spinner'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { TABLET } from '~/shared/utils/styled'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { getSelfDelegationFraction, getSpotApy } from '~/getters'
import { ParsedOperator } from '~/parsers/OperatorParser'
import {
    useDelegateFunds,
    useIsDelegatingFundsToOperator,
    useIsUndelegatingFundsToOperator,
    useUndelegateFunds,
} from '~/hooks/operators'
import { isRejectionReason } from '~/modals/BaseModal'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { Tip, TipIconWrap } from '~/components/Tip'
import { AboutOperator } from '~/components/AboutOperator'
import { getOperatorDelegationAmount } from '~/services/operators'
import { PencilIcon } from '~/icons'
import {
    ActionBarButton,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from './ActionBarButton'

export const OperatorActionBar: FunctionComponent<{
    operator: ParsedOperator
    handleEdit: (operator: ParsedOperator) => void
    onDelegationChange: () => void
    tokenSymbol: string
}> = ({ operator, handleEdit, onDelegationChange, tokenSymbol }) => {
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

    const canUndelegate = useDidDelegate(operator.id, walletAddress)

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.operators()}>
                                <NetworkActionBarBackButtonIcon name="backArrow"></NetworkActionBarBackButtonIcon>
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>
                                {operator.metadata?.imageUrl ? (
                                    <HubImageAvatar
                                        src={operator.metadata.imageUrl}
                                        alt={operator.metadata.name || operator.id}
                                    />
                                ) : (
                                    <HubAvatar id={operator.id} />
                                )}
                                <span>{operator.metadata?.name || operator.id}</span>
                            </NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            {canEdit && (
                                <ActionBarButton
                                    onClick={() => void handleEdit(operator)}
                                >
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
                            <ActionBarWalletDisplay
                                address={operator.id}
                                label="Contract"
                            />
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>
                        <Button
                            onClick={async () => {
                                try {
                                    if (!walletAddress) {
                                        return
                                    }

                                    await delegateFunds({
                                        operator,
                                        wallet: walletAddress,
                                    })

                                    onDelegationChange()
                                } catch (e) {
                                    if (isRejectionReason(e)) {
                                        return
                                    }

                                    console.warn('Could not delegate funds', e)
                                }
                            }}
                            disabled={!walletAddress}
                            waiting={isDelegatingFunds}
                        >
                            Delegate
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    if (!walletAddress) {
                                        return
                                    }

                                    await undelegateFunds({
                                        operator,
                                        wallet: walletAddress,
                                    })

                                    onDelegationChange()
                                } catch (e) {
                                    if (isRejectionReason(e)) {
                                        return
                                    }

                                    console.warn('Could not undelegate funds', e)
                                }
                            }}
                            disabled={!canUndelegate}
                            waiting={isUndelegatingFunds}
                        >
                            Undelegate
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>Operator summary</NetworkActionBarStatsTitle>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell
                            label="Total value"
                            tip={
                                <>
                                    {operator.valueWithoutEarnings.isZero() && (
                                        <Tip
                                            handle={
                                                <TipIconWrap $color="#ff5c00">
                                                    <JiraFailedBuildStatusIcon label="Error" />
                                                </TipIconWrap>
                                            }
                                        >
                                            <p>
                                                You need to deposit {tokenSymbol} tokens
                                                into your operator contract before you can
                                                stake on sponsorships or receive
                                                delegations.
                                            </p>
                                        </Tip>
                                    )}
                                </>
                            }
                        >
                            {abbreviateNumber(
                                fromAtto(operator.valueWithoutEarnings).toNumber(),
                            )}{' '}
                            {tokenSymbol}
                        </StatCell>
                        <StatCell label="Deployed stake">
                            {`${abbreviateNumber(
                                fromAtto(operator.totalStakeInSponsorshipsWei).toNumber(),
                            )} ${tokenSymbol}`}
                        </StatCell>
                        <StatCell label="Owner's delegation">
                            {ownerDelegationPercentage.toFixed(0)}%
                        </StatCell>
                        <StatCell label="Redundancy factor">
                            {operator.metadata?.redundancyFactor?.toString() || '1'}
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="Operator's cut">
                            {operator.operatorsCut}%
                        </StatCell>
                        <StatCell label="Spot APY">
                            {(getSpotApy(operator) * 100).toFixed(0)}%
                        </StatCell>
                        <StatCell label="Cumulative earnings">
                            {`${abbreviateNumber(
                                fromAtto(
                                    operator.cumulativeProfitsWei.plus(
                                        operator.cumulativeOperatorsCutWei,
                                    ),
                                ).toNumber(),
                            )} ${tokenSymbol}`}
                        </StatCell>
                        <StatCell label="Live nodes">
                            <>
                                {liveNodeCountIsLoading ? (
                                    <Spinner color="blue" />
                                ) : (
                                    liveNodeCount.toString()
                                )}
                            </>
                        </StatCell>
                    </StatGrid>
                </Pad>
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

export const Pad = styled.div`
    padding: 20px 0;

    ${TipIconWrap} svg {
        height: 18px;
        width: 18px;
    }

    @media ${TABLET} {
        padding: 32px 40px;
    }
`

function useDidDelegate(operatorId: string | undefined, address: string | undefined) {
    const [delegated, setDelegated] = useState<boolean>()

    useEffect(() => {
        if (!operatorId || !address) {
            return void setDelegated(false)
        }

        let mounted = true

        void (async () => {
            let result = false

            try {
                result = (
                    await getOperatorDelegationAmount(operatorId, address)
                ).isGreaterThan(0)
            } catch (e) {
                console.warn('Failed to load delegation amount', operatorId, address, e)
            }

            if (mounted) {
                setDelegated(result)
            }
        })()

        return () => {
            mounted = false
        }
    }, [operatorId, address])

    return delegated
}
