import { toaster } from 'toasterhea'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { Layer } from '~/utils/Layer'
import { BN, toBN } from '~/utils/bn'
import {
    delegateToOperator,
    getOperatorDelegationAmount,
    undelegateFromOperator,
} from '~/services/operators'
import getChainId from '~/utils/web3/getChainId'
import { getConfigForChain } from '~/shared/web3/config'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { OperatorElement } from '~/types/operator'
import { useConfigFromChain } from '~/hooks/useConfigFromChain'
import { getDelegationAmountForAddress } from '~/utils/delegation'
import { useWalletAccount } from '~/shared/stores/wallet'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import UndelegateFundsModal from '~/modals/UndelegateFundsModal'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
export const useDelegateAndUndelegateFunds = (): {
    delegateFunds: (operator: OperatorElement) => Promise<boolean>
    undelegateFunds: (operator: OperatorElement) => Promise<boolean>
} => {
    const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)
    const undelegateFundsModal = toaster(UndelegateFundsModal, Layer.Modal)
    const walletAddress = useWalletAccount()
    const { minimumSelfDelegationFraction } = useConfigFromChain()

    const getDelegationAmount = async (
        operator: OperatorElement,
        address: string,
    ): Promise<BN> => {
        return await getOperatorDelegationAmount(operator.id, address)
    }

    const getBalance = async (
        operator: OperatorElement,
        address: string,
    ): Promise<BN> => {
        const chainId = await getChainId()
        const chainConfig = getConfigForChain(chainId)
        return await getCustomTokenBalance(
            chainConfig.contracts['DATA'],
            address,
            chainId,
        )
    }

    const getOwnerDelegationPercentage = (operator: OperatorElement): BN => {
        const stake = getDelegationAmountForAddress(operator.owner, operator)
        if (stake.isEqualTo(BN(0)) || operator.valueWithoutEarnings.isEqualTo(BN(0))) {
            return BN(0)
        }
        return stake.dividedBy(operator.valueWithoutEarnings).multipliedBy(100)
    }

    return {
        delegateFunds: async (operator: OperatorElement) => {
            if (!walletAddress) {
                return false
            }
            try {
                const balance = await getBalance(operator, walletAddress)
                const delegationAmount = await getDelegationAmount(
                    operator,
                    walletAddress,
                )
                const tokenInfo = await getSponsorshipTokenInfo()
                const ownerStakePercentage = await getOwnerDelegationPercentage(operator)

                console.log(
                    'ooo',
                    ownerStakePercentage.toString(),
                    toBN(minimumSelfDelegationFraction).toString(),
                )

                await delegateFundsModal.pop({
                    operatorId: operator.id,
                    tokenSymbol: tokenInfo.symbol,
                    decimals: tokenInfo.decimals,
                    balance: balance?.toString(),
                    delegatedTotal: delegationAmount
                        ? fromDecimals(delegationAmount, tokenInfo.decimals).toString()
                        : '0',
                    tooLowOwnerSelfDelegation: ownerStakePercentage.isLessThan(
                        toBN(minimumSelfDelegationFraction),
                    ),
                    isCurrentUserOwner: operator.owner === walletAddress,
                    onSubmit: async (amount: BN) => {
                        try {
                            await delegateToOperator(operator.id, amount)
                            await waitForGraphSync()
                        } catch (e) {
                            console.warn('Could not delegate', e)
                        }
                    },
                })
                return true
            } catch (e) {
                return false
            }
        },
        undelegateFunds: async (operator: OperatorElement): Promise<boolean> => {
            if (!walletAddress) {
                return false
            }
            try {
                const balance = await getBalance(operator, walletAddress)
                const delegationAmount = await getDelegationAmount(
                    operator,
                    walletAddress,
                )
                const tokenInfo = await getSponsorshipTokenInfo()
                await undelegateFundsModal.pop({
                    operatorId: operator.id,
                    isCurrentUserOwner: operator.owner === walletAddress,
                    tokenSymbol: tokenInfo.symbol,
                    decimals: tokenInfo.decimals,
                    balance: balance?.toString(),
                    freeFunds: fromDecimals(
                        operator.dataTokenBalance,
                        tokenInfo.decimals,
                    ).toString(),
                    delegatedTotal: delegationAmount
                        ? fromDecimals(delegationAmount, tokenInfo.decimals).toString()
                        : '0',
                    minimumSelfDelegation:
                        minimumSelfDelegationFraction != null
                            ? fromDecimals(
                                  minimumSelfDelegationFraction,
                                  tokenInfo.decimals,
                              ).toString()
                            : '0',
                    onSubmit: async (amount: BN) => {
                        try {
                            let finalAmount = amount

                            // Check if we are undelegating all our funds
                            if (
                                delegationAmount != null &&
                                amount.isGreaterThanOrEqualTo(delegationAmount)
                            ) {
                                // Signal contract that we want to undelegate all of our funds
                                finalAmount = BN(Infinity)
                            }
                            await undelegateFromOperator(operator.id, finalAmount)
                            await waitForGraphSync()
                        } catch (e) {
                            console.warn('Could not undelegate', e)
                        }
                    },
                })
                return true
            } catch (e) {
                return false
            }
        },
    }
}
