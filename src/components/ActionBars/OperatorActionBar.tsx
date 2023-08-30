import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { toaster } from 'toasterhea'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { truncate } from '~/shared/utils/text'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { getOperatorDelegationAmount } from '~/services/operators'
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
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
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
const undelegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)

export const OperatorActionBar: FunctionComponent<{
    operator: OperatorElement
}> = ({ operator }) => {
    const [balance, setBalance] = useState<BNish | undefined>(undefined)
    const [delegationAmount, setDelegationAmount] = useState<BN | undefined>(undefined)
    const { copy } = useCopy()
    const { count: liveNodeCount } = useOperatorLiveNodes(operator.id)
    const walletAddress = useWalletAccount()

    const ownerDelegationPercentage = useMemo(() => {
        const stake = getDelegationAmountForAddress(operator.owner, operator)
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
                            <NetworkActionBarTitle>{operator.id}</NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            <NetworkActionBarInfoButton>
                                <SvgIcon name="page" />
                                About Operators
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <span>
                                    Owner: <strong>{operator.owner}</strong>
                                </span>
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
                                try {
                                    await delegateFundsModal.pop({
                                        operatorId: operator.id,
                                        balance: balance?.toString(),
                                        delegatedTotal: delegationAmount
                                            ?.dividedBy(1e18)
                                            .toString(),
                                    })
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Delegate
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await undelegateFundsModal.pop({})
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
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
                                operator.totalValueInSponsorshipsWei,
                            ).toString(),
                        },
                        {
                            label: "Owner's delegation",
                            value: `${ownerDelegationPercentage.toFixed(0)}%`,
                        },
                        {
                            label: 'Sponsorships',
                            value: operator.stakes.length.toString(),
                        },
                        {
                            label: "Operator's cut",
                            value: `${fromAtto(operator.operatorsCutFraction).toFixed(
                                2,
                            )}%`,
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
