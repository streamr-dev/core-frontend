import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { truncate } from '~/shared/utils/text'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import UndelegateFundsModal from '~/modals/UndelegateFundsModal'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import {
    delegateToOperator,
    getOperatorDelegationAmount,
    undelegateFromOperator,
} from '~/services/operators'
import { Layer } from '~/utils/Layer'
import routes from '~/routes'
import { OperatorElement } from '~/types/operator'
import { calculateOperatorSpotAPY } from '~/utils/apy'
import { getDelegationAmountForAddress } from '~/utils/delegation'
import { fromAtto } from '~/marketplace/utils/math'
import { useWalletAccount } from '~/shared/stores/wallet'
import { getConfigForChain } from '~/shared/web3/config'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import getChainId from '~/utils/web3/getChainId'
import { BN, BNish } from '~/utils/bn'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { SimpleDropdown } from '~/components/SimpleDropdown'
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
} from './NetworkActionBar.styles'

const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)
const undelegateFundsModal = toaster(UndelegateFundsModal, Layer.Modal)

export const OperatorActionBar: FunctionComponent<{
    operator: OperatorElement
    handleEdit: (operator: OperatorElement) => void
}> = ({ operator, handleEdit }) => {
    const [balance, setBalance] = useState<BNish | undefined>(undefined)
    const [delegationAmount, setDelegationAmount] = useState<BN | undefined>(undefined)
    const { copy } = useCopy()
    const { count: liveNodeCount } = useOperatorLiveNodes(operator.id)
    const walletAddress = useWalletAccount()
    const canEdit = !!walletAddress && walletAddress == operator.owner

    const ownerDelegationPercentage = useMemo(() => {
        const stake = getDelegationAmountForAddress(operator.owner, operator)
        if (stake.isEqualTo(BN(0)) || operator.poolValue.isEqualTo(BN(0))) {
            return BN(0)
        }
        return stake.dividedBy(operator.poolValue).multipliedBy(100)
    }, [operator])

    useEffect(() => {
        const loadBalance = async () => {
            if (operator.id && walletAddress) {
                const chainId = await getChainId()
                const chainConfig = getConfigForChain(chainId)
                const balance = await getCustomTokenBalance(
                    chainConfig.contracts['DATA'],
                    walletAddress,
                    chainId,
                )
                setBalance(balance)
            }
        }

        loadBalance()
    }, [operator.id, walletAddress])

    useEffect(() => {
        const loadAmount = async () => {
            if (operator.id && walletAddress) {
                const amount = await getOperatorDelegationAmount(
                    operator.id,
                    walletAddress,
                )
                setDelegationAmount(amount)
            }
        }

        loadAmount()
    }, [operator.id, walletAddress])

    // TODO when Mariusz will merge his hook & getter for fetching Token information - use it here to display the proper token symbol

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
                                        exchange, they earn DATA tokens from sponsorships
                                        they stake on. The stake guarantees that the
                                        operators do the work, otherwise they get slashed.
                                        Learn more{' '}
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
                                    href={
                                        'https://polygonscan.com/address/' +
                                        operator.owner
                                    }
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
                                    href={
                                        'https://polygonscan.com/address/' + operator.id
                                    }
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
                                await delegateFundsModal.pop({
                                    operatorId: operator.id,
                                    balance: balance?.toString(),
                                    delegatedTotal: delegationAmount
                                        ?.dividedBy(1e18)
                                        .toString(),
                                    onSubmit: async (amount: BN) => {
                                        await delegateToOperator(operator.id, amount)
                                    },
                                })
                            }}
                            disabled={walletAddress == null}
                        >
                            Delegate
                        </Button>
                        <Button
                            onClick={async () => {
                                await undelegateFundsModal.pop({
                                    operatorId: operator.id,
                                    balance: balance?.toString(),
                                    freeFunds: operator.freeFundsWei
                                        .dividedBy(1e18)
                                        .toString(),
                                    delegatedTotal: delegationAmount
                                        ?.dividedBy(1e18)
                                        .toString(),
                                    onSubmit: async (amount: BN) => {
                                        await undelegateFromOperator(operator.id, amount)
                                    },
                                })
                            }}
                            disabled={walletAddress == null}
                        >
                            Undelegate
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>Operator summary</NetworkActionBarStatsTitle>
                <WhiteBoxSeparator />
                <StatsBox
                    stats={[
                        {
                            label: 'Total value',
                            value: fromAtto(operator.poolValue).toString(),
                        },
                        {
                            label: 'Deployed stake',
                            value: fromAtto(
                                operator.totalStakeInSponsorshipsWei,
                            ).toString(),
                        },
                        {
                            label: "Owner's delegation",
                            value: `${ownerDelegationPercentage.toFixed(0)}%`,
                        },
                        {
                            label: 'Redundancy factor',
                            value: operator.metadata?.redundancyFactor?.toString() || '1',
                        },
                        {
                            label: "Operator's cut",
                            value: `${operator.operatorsCutFraction}%`,
                        },
                        {
                            label: 'Spot APY',
                            value: `${calculateOperatorSpotAPY(operator).toFixed(0)}%`,
                        },
                        {
                            label: 'Cumulative earnings',
                            value: `${fromAtto(
                                operator.cumulativeProfitsWei.plus(
                                    operator.cumulativeOperatorsCutWei,
                                ),
                            ).toString()}`,
                        },
                        {
                            label: 'Live nodes',
                            value: liveNodeCount.toString(),
                        },
                    ]}
                    columns={4}
                />
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

const AboutOperatorsContent = styled.div`
    margin: 0;
    min-width: 250px;
`
