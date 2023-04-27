import EventEmitter from 'events'
import { PromiEvent, TransactionReceipt } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { isHex } from 'web3-utils'
import BN from 'bignumber.js'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import TransactionError from '$shared/errors/TransactionError'
import { SmartContractCall, Address, SmartContractConfig, SmartContractTransaction } from '$shared/types/web3-types'
import { NumberString } from '$shared/types/common-types'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import Transaction from '$shared/utils/Transaction'
import TransactionRejectedError from '$shared/errors/TransactionRejectedError'

// TODO add typing
export type Callable = {
    call: () => SmartContractCall<any>
}
// TODO add typing
export type Sendable = {
    send: (arg0: { from: Address, gas: any, value: any, maxPriorityFeePerGas: any, maxFeePerGas: any }) => PromiEvent<any>
}
export const areAddressesEqual = (first: Address, second: Address): boolean => (first || '').toLowerCase() === (second || '').toLowerCase()
export const hexEqualsZero = (hex: string): boolean => /^(0x)?0+$/.test(hex)
export const getPrefixedHexString = (hex: string): string => hex.replace(/^0x|^/, '0x')
export const getUnprefixedHexString = (hex: string): string => hex.replace(/^0x|^/, '')

/**
 * Tells if the given string is valid hex or not.
 * @param hex string to validate. Can have the 0x prefix or not
 * @returns {boolean}
 */
export const isValidHexString = (hex: string): boolean => (typeof hex === 'string') && isHex(hex)
/**
 * @deprecated Use `web3.eth.Contract` directly. The main reason why this is a utility function
 * is the `usePublicNode` flag. It's going away (work in progress).
 */
export const getContract = ({ abi, address }: SmartContractConfig, usePublicNode = false, chainId?: number): Contract => {
    if (usePublicNode && chainId == null) {
        throw new Error('ChainId must be provided!')
    }

    const web3 = usePublicNode ? getPublicWeb3(chainId) : getWeb3()
    return new web3.eth.Contract(abi, address)
}

export const call = (method: Callable): SmartContractCall<any> => method.call()
export const send = (
    method: Sendable,
    options?: {
        gas?: number
        value?: NumberString | BN
        network?: number
    },
): SmartContractTransaction => {
    const emitter = new EventEmitter()

    // NOTE: looks like there's double handling of errors happening here
    // i.e. .catch + on('error')
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }

    const tx = new Transaction(emitter)
    Promise.all([
        getDefaultWeb3Account(),
        checkEthereumNetworkIsCorrect({
            network: options && options.network,
        }),
    ]).then(
        ([account]) =>
            method
                .send({
                    gas: options && options.gas,
                    from: account,
                    value: options && options.value,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                })
                .on('error', (error: Error | TransactionReceipt) => {
                    if (error instanceof Error) {
                        errorHandler(error)
                    } else {
                        if ((error as any).code === 4001) {
                            // User rejected the transaction in Metamask
                            errorHandler(new TransactionRejectedError())
                        } else {
                            errorHandler(new TransactionError('Transaction error', error))
                        }
                    }
                })
                .on('transactionHash', (hash) => {
                    emitter.emit('transactionHash', hash)
                })
                .once('receipt', (receipt: TransactionReceipt) => {
                    if (!receipt.status) {
                        errorHandler(new TransactionError('Transaction failed', receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                }),
        errorHandler,
    )
    return tx
}
