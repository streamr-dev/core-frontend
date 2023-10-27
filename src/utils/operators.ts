import { toaster } from 'toasterhea'
import { getBalance } from '~/getters/getBalance'
import getCoreConfig from '~/getters/getCoreConfig'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import { fromDecimals } from '~/marketplace/utils/math'
import UndelegateFundsModal from '~/modals/UndelegateFundsModal'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { getOperatorDelegationAmount, undelegateFromOperator } from '~/services/operators'
import { Layer } from '~/utils/Layer'
import { BNish, toBN } from '~/utils/bn'
import networkPreflight from '~/utils/networkPreflight'
import { defaultChainConfig } from '~/getters/getChainConfig'

const undelegateFundsModal = toaster(UndelegateFundsModal, Layer.Modal)

/**
 * Walks the user through the undelegation process.
 */
export async function undelegateFunds({
    minimumSelfDelegationFraction,
    operator,
    wallet,
}: {
    minimumSelfDelegationFraction: BNish | undefined
    operator: ParsedOperator
    wallet: string
}) {
    const chainId = defaultChainConfig.id
    await networkPreflight(chainId)

    const paymentTokenSymbol = getCoreConfig().sponsorshipPaymentToken

    const balance = (await getBalance(wallet, paymentTokenSymbol)).toString()

    const { symbol: tokenSymbol, decimals } = await getSponsorshipTokenInfo()

    const delegationAmount = await getOperatorDelegationAmount(operator.id, wallet)

    await undelegateFundsModal.pop({
        operatorId: operator.id,
        isCurrentUserOwner: operator.owner.toLowerCase() === wallet.toLowerCase(),
        tokenSymbol,
        decimals,
        balance,
        freeFunds: fromDecimals(operator.dataTokenBalanceWei, decimals).toString(),
        delegatedTotal: fromDecimals(delegationAmount, decimals).toString(),
        minimumSelfDelegation:
            minimumSelfDelegationFraction != null
                ? fromDecimals(minimumSelfDelegationFraction, decimals).toString()
                : '0',
        async onSubmit(amount) {
            await undelegateFromOperator(
                operator.id,
                amount.isGreaterThanOrEqualTo(delegationAmount)
                    ? toBN(Number.POSITIVE_INFINITY)
                    : amount,
            )

            await waitForGraphSync()
        },
    })
}
