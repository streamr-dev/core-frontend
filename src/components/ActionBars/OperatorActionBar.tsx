import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
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
import { getOperatorDelegationAmount } from '~/services/operators'
import { PencilIcon } from '~/icons'
import { goBack } from '~/utils'
import {
    ActionBarButton,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { AboutOperator } from '~/components/ActionBars/AboutOperator'
import { SponsorshipPaymentTokenName } from '../SponsorshipPaymentTokenName'

export const OperatorActionBar: FunctionComponent<{
    operator: ParsedOperator
    handleEdit: (operator: ParsedOperator) => void
    onDelegationChange: () => void
}> = ({ operator, handleEdit, onDelegationChange }) => {
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
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink
                                to={routes.network.operators()}
                                onClick={(e) => {
                                    goBack({
                                        onBeforeNavigate() {
                                            e.preventDefault()
                                        },
                                    })
                                }}
                            >
                                <NetworkActionBarBackButtonIcon name="backArrow" />
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>
                                {metadata.imageUrl ? (
                                    <HubImageAvatar
                                        src={metadata.imageUrl}
                                        alt={metadata.name || operator.id}
                                    />
                                ) : (
                                    <HubAvatar id={operator.id} />
                                )}
                                <span>{metadata.name || operator.id}</span>
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
                                label="Operator"
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
                            {delegateLabel}
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
                            {undelegateLabel}
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>Operator summary</NetworkActionBarStatsTitle>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell
                            label="Total stake"
                            tip={
                                <>
                                    {operator.valueWithoutEarnings.isZero() ? (
                                        <Tip
                                            handle={
                                                <TipIconWrap $color="#ff5c00">
                                                    <JiraFailedBuildStatusIcon label="Error" />
                                                </TipIconWrap>
                                            }
                                        >
                                            <p>
                                                The owner must fund the Operator with{' '}
                                                <SponsorshipPaymentTokenName /> tokens
                                                before it can be used for staking on
                                                sponsorships or receiving delegations.
                                            </p>
                                        </Tip>
                                    ) : (
                                        <Tip
                                            shift="right"
                                            handle={
                                                <IconWrap>
                                                    <QuestionMarkIcon />
                                                </IconWrap>
                                            }
                                        >
                                            <p>
                                                The total amount of{' '}
                                                <SponsorshipPaymentTokenName /> tokens
                                                that are staked on the Operator, including
                                                deployed and undeployed tokens.
                                            </p>
                                        </Tip>
                                    )}
                                </>
                            }
                        >
                            <div>
                                {abbreviateNumber(
                                    fromAtto(operator.valueWithoutEarnings).toNumber(),
                                )}{' '}
                                <SponsorshipPaymentTokenName />
                            </div>
                        </StatCell>
                        <StatCell
                            label="Deployed stake"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The amount of <SponsorshipPaymentTokenName />{' '}
                                        tokens that the Operator has staked on
                                        Sponsorships.
                                    </p>
                                </Tip>
                            }
                        >
                            {abbreviateNumber(
                                fromAtto(operator.totalStakeInSponsorshipsWei).toNumber(),
                            )}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                        <StatCell
                            label="Owner's stake"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The percentage of stake supplied from the owner of
                                        the Operator.
                                    </p>
                                </Tip>
                            }
                        >
                            {ownerDelegationPercentage.toFixed(0)}%
                        </StatCell>
                        <StatCell
                            label="Node redundancy"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The amount of duplicated work when running a fleet
                                        of multiple nodes.
                                    </p>
                                    <p>
                                        Doing redundant work protects against slashing in
                                        case some of your nodes experience failures. For
                                        example,
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>a redundancy factor of 1</strong>{' '}
                                            means that no duplication of work occurs (the
                                            feature is off), and
                                        </li>
                                        <li>
                                            <strong>setting it to 2</strong> means that
                                            each stream assignment will be worked on by 2
                                            nodes in the fleet.
                                        </li>
                                    </ul>
                                </Tip>
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
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The fee that the owner of the Operator takes from
                                        all earnings.
                                    </p>
                                    <p>
                                        The remaining earnings are distributed among all
                                        stakeholders in the Operator, which includes
                                        delegators and the owner, in proportion to the
                                        size of their respective stakes.
                                    </p>
                                </Tip>
                            }
                        >
                            {operator.operatorsCut}%
                        </StatCell>
                        <StatCell
                            label="Spot APY"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The annualized yield that this Operator is earning
                                        right now, calculated from the&nbsp;present payout
                                        rates of the Sponsorships the Operator is
                                        currently&nbsp;staked in.
                                    </p>
                                </Tip>
                            }
                        >
                            {(getSpotApy(operator) * 100).toFixed(0)}%
                        </StatCell>
                        <StatCell
                            label="Cumulative earnings"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The total earnings that this Operator has
                                        accumulated over its whole&nbsp;lifetime.
                                    </p>
                                </Tip>
                            }
                        >
                            {abbreviateNumber(
                                fromAtto(
                                    operator.cumulativeProfitsWei.plus(
                                        operator.cumulativeOperatorsCutWei,
                                    ),
                                ).toNumber(),
                            )}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                        <StatCell
                            label="Live nodes"
                            tip={
                                <Tip
                                    shift="right"
                                    handle={
                                        <IconWrap>
                                            <QuestionMarkIcon />
                                        </IconWrap>
                                    }
                                >
                                    <p>
                                        The number of online nodes detected that are doing
                                        work for this Operator.
                                    </p>
                                </Tip>
                            }
                        >
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

function getQuestionMarkIconAttrs(): ComponentProps<typeof SvgIcon> {
    return { name: 'outlineQuestionMark' }
}

const QuestionMarkIcon = styled(SvgIcon).attrs(getQuestionMarkIconAttrs)`
    display: block;
    height: 16px;
    width: 16px;
`

const IconWrap = styled.div<{ $color?: string }>`
    align-items: center;
    color: ${({ $color = 'inherit' }) => $color};
    display: flex;
    height: 24px;
    justify-content: center;
    position: relative;
    width: 24px;
`
