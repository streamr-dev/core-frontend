// @flow

import EventEmitter from 'events'
import type { Web3, PromiEvent } from 'web3'
import { isHex } from 'web3-utils'
import BN from 'bignumber.js'

import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import getWeb3 from '$utils/web3/getWeb3'
import getPublicWeb3 from '$utils/web3/getPublicWeb3'
import TransactionError from '$shared/errors/TransactionError'
import type {
    SmartContractCall,
    Address,
    SmartContractConfig,
    SmartContractTransaction,
} from '$shared/flowtype/web3-types'
import type { NumberString } from '$shared/flowtype/common-types'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'

import Transaction from '$shared/utils/Transaction'
import type { Product, SmartContractProduct } from '../flowtype/product-types'
import { arePricesEqual } from '../utils/price'

export type Callable = {
    call: () => SmartContractCall<*>,
}

export type Sendable = {
    send: ({
        from: Address,
    }) => PromiEvent,
}

export const areAddressesEqual = (first: Address, second: Address) => (first || '').toLowerCase() === (second || '').toLowerCase()

export const hexEqualsZero = (hex: string): boolean => /^(0x)?0+$/.test(hex)

export const getPrefixedHexString = (hex: string): string => hex.replace(/^0x|^/, '0x')

export const getUnprefixedHexString = (hex: string): string => hex.replace(/^0x|^/, '')

/**
 * Tells if the given string is valid hex or not.
 * @param hex string to validate. Can have the 0x prefix or not
 * @returns {boolean}
 */
export const isValidHexString = (hex: string): boolean => (typeof hex === 'string' || hex instanceof String) && isHex(hex)

export const getContract = ({ abi, address }: SmartContractConfig, usePublicNode: boolean = false, chainId?: number): Web3.eth.Contract => {
    if (usePublicNode && chainId == null) {
        throw new Error('ChainId must be provided!')
    }

    const web3 = usePublicNode ? getPublicWeb3(chainId) : getWeb3()
    return new web3.eth.Contract(abi, address)
}

export const isUpdateContractProductRequired = (contractProduct: SmartContractProduct, editProduct: Product) => (
    (!arePricesEqual(contractProduct.pricePerSecond, editProduct.pricePerSecond) ||
    !areAddressesEqual(contractProduct.beneficiaryAddress, editProduct.beneficiaryAddress) ||
    contractProduct.priceCurrency !== editProduct.priceCurrency)
)

export const call = (method: Callable): SmartContractCall<*> => method.call()

export const send = (method: Sendable, options?: {
    gas?: number,
    value?: NumberString | BN,
    network?: number,
}): SmartContractTransaction => {
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
            network: (options && options.network),
        }),
    ])
        .then(([account]) => (
            method.send({
                gas: (options && options.gas),
                from: account,
                value: options && options.value,
            })
                .on('error', (error, receipt) => {
                    if (receipt) {
                        errorHandler(new TransactionError(error.message, receipt))
                    } else {
                        errorHandler(error)
                    }
                })
                .on('transactionHash', (hash) => {
                    emitter.emit('transactionHash', hash)
                })
                .on('receipt', (receipt) => {
                    if (parseInt(receipt.status, 16) === 0) {
                        errorHandler(new TransactionError('Transaction failed', receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
        ), errorHandler)

    return tx
}
