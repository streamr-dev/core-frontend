import { toaster } from 'toasterhea'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { Layer } from '~/utils/Layer'
import { BN } from '~/utils/bn'
import {
    delegateToOperator,
    getOperatorDelegationAmount,
    undelegateFromOperator,
} from '~/services/operators'
import { OperatorElement } from '~/types/operator'
import { useConfigFromChain } from '~/hooks/useConfigFromChain'
import { useWalletAccount } from '~/shared/stores/wallet'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import UndelegateFundsModal from '~/modals/UndelegateFundsModal'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { fromDecimals } from '~/marketplace/utils/math'
import { getBalance } from '~/getters/getBalance'
import getCoreConfig from '~/getters/getCoreConfig'
export const useDelegateAndUndelegateFunds = (): {
    delegateFunds: (operator: OperatorElement) => Promise<void>
    undelegateFunds: (operator: OperatorElement) => Promise<void>
} => {
    const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)
    const undelegateFundsModal = toaster(UndelegateFundsModal, Layer.Modal)
    const walletAddress = useWalletAccount()
    const { minimumSelfDelegationFraction } = useConfigFromChain()
    const tokenSymbol = getCoreConfig().sponsorshipPaymentToken

    return {
        delegateFunds: async (operator: OperatorElement): Promise<void> => {
            if (!walletAddress) {
                throw new Error('No wallet connected')
            }
            const balance = await getBalance(walletAddress, tokenSymbol)
            const delegationAmount = await getOperatorDelegationAmount(
                operator.id,
                walletAddress,
            )
            const tokenInfo = await getSponsorshipTokenInfo()

            await delegateFundsModal.pop({
                operator: operator,
                tokenSymbol: tokenInfo.symbol,
                decimals: tokenInfo.decimals,
                balance: balance?.toString(),
                delegatedTotal: delegationAmount
                    ? fromDecimals(delegationAmount, tokenInfo.decimals).toString()
                    : '0',
                onSubmit: async (amount: BN) => {
                    try {
                        await delegateToOperator(operator.id, amount)
                        await waitForGraphSync()
                    } catch (e) {
                        console.warn('Could not delegate', e)
                    }
                },
            })
        },
        undelegateFunds: async (operator: OperatorElement): Promise<void> => {
            if (!walletAddress) {
                throw new Error('No wallet connected')
            }
            const balance = await getBalance(walletAddress, tokenSymbol)
            const delegationAmount = await await getOperatorDelegationAmount(
                operator.id,
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
        },
    }
}
