import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { truncate } from '~/shared/utils/text'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import routes from '~/routes'
import { fromAtto } from '~/marketplace/utils/math'
import { useWalletAccount } from '~/shared/stores/wallet'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import Spinner from '~/shared/components/Spinner'
import { getBlockExplorerUrl } from '~/getters/getBlockExplorerUrl'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { TABLET } from '~/shared/utils/styled'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCaret,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButton,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
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
import { Tip, TipIconWrap } from '../Tip'

export const OperatorActionBar: FunctionComponent<{
    operator: ParsedOperator
    handleEdit: (operator: ParsedOperator) => void
    onDelegationChange: () => void
    tokenSymbol: string
}> = ({ operator, handleEdit, onDelegationChange, tokenSymbol }) => {
    const { copy } = useCopy()

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

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.operators()}>
                                <NetworkActionBarBackButtonIcon
                                    name={'backArrow'}
                                ></NetworkActionBarBackButtonIcon>
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
                                <NetworkActionBarInfoButton
                                    className="pointer bold"
                                    onClick={() => handleEdit(operator)}
                                >
                                    <span>Edit Operator</span>
                                    <SvgIcon name={'pencil'} />
                                </NetworkActionBarInfoButton>
                            )}
                            <SimpleDropdown
                                toggleElement={
                                    <NetworkActionBarInfoButton className="pointer bold">
                                        <SvgIcon name="page" />
                                        About Operators
                                        <NetworkActionBarCaret name="caretDown" />
                                    </NetworkActionBarInfoButton>
                                }
                                dropdownContent={
                                    <AboutOperatorsContent>
                                        {operator.metadata?.description && (
                                            <p>{operator.metadata.description}</p>
                                        )}
                                        Operators secure and stabilize the Streamr Network
                                        by running nodes and contributing bandwidth. In
                                        exchange, they earn{' '}
                                        <SponsorshipPaymentTokenName /> tokens from
                                        sponsorships they stake on. The stake guarantees
                                        that the operators do the work, otherwise they get
                                        slashed. Learn more{' '}
                                        <a
                                            href="https://docs.streamr.network/streamr-network/network-incentives"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            here
                                        </a>
                                        .
                                    </AboutOperatorsContent>
                                }
                            />
                            <NetworkActionBarInfoButton>
                                <span>
                                    Owner: <strong>{truncate(operator.owner)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(operator.owner, {
                                                toastMessage: 'Copied!',
                                            })
                                        }
                                    />
                                    <BlackTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </BlackTooltip>
                                </span>
                                <a
                                    href={`${getBlockExplorerUrl()}/address/${
                                        operator.owner
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <SvgIcon name="externalLink" />
                                </a>
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <span>
                                    Contract <strong>{truncate(operator.id)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(operator.id, {
                                                toastMessage: 'Copied!',
                                            })
                                        }
                                    />
                                    <BlackTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </BlackTooltip>
                                </span>
                                <a
                                    href={`${getBlockExplorerUrl()}/address/${
                                        operator.id
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <SvgIcon name="externalLink" />
                                </a>
                            </NetworkActionBarInfoButton>
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
                            disabled={!walletAddress}
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

const AboutOperatorsContent = styled.div`
    margin: 0;
    min-width: 250px;
`

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

const TotalValue = styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: auto auto;
`
