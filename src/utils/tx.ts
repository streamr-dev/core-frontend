import {
    BaseContract,
    ContractTransactionResponse,
    isError,
    TransactionReceipt,
    TransactionResponse,
} from 'ethers'
import { getWalletWeb3Provider } from '~/shared/stores/wallet'

export interface CallableOptions {
    onReceipt?(receipt: TransactionReceipt): void | Promise<void>
}

type CallMethodName<C extends BaseContract> = {
    [K in keyof C]: C[K] extends () => Promise<ContractTransactionResponse> ? K : never
}[keyof C]

type CallMethodArgs<C extends BaseContract, M extends keyof C> = C[M] extends (
    ...args: infer R
) => any
    ? R
    : []

interface CallParams<C extends BaseContract, M extends keyof C> extends CallableOptions {
    args: CallMethodArgs<C, M>
    replaceable?: boolean
}

export async function call<C extends BaseContract, M extends CallMethodName<C>>(
    contract: C,
    method: M,
    params: CallParams<C, M>,
): Promise<void> {
    const { args, onReceipt, replaceable = true } = params

    const provider = await getWalletWeb3Provider()

    const blockNumber = await provider.getBlockNumber()

    let tx: TransactionResponse = await (
        contract[method] as (
            ...args: CallParams<C, M>['args']
        ) => Promise<ContractTransactionResponse>
    )(...args)

    if (replaceable) {
        tx = tx.replaceableTransaction(blockNumber)
    }

    for (;;) {
        try {
            const receipt = await tx.wait()

            if (receipt) {
                await onReceipt?.(receipt)
            }

            break
        } catch (e) {
            if (!isError(e, 'TRANSACTION_REPLACED') || e.cancelled) {
                throw e
            }

            tx = e.replacement
        }
    }
}
