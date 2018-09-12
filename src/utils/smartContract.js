// @flow

import EventEmitter from 'events'
import type { PromiEvent } from 'web3'
import { I18n } from '@streamr/streamr-layout'
import web3Utils from 'web3-utils'

import { arePricesEqual } from '../utils/price'
import { isPaidProduct } from '../utils/product'
import { checkEthereumNetworkIsCorrect } from '../utils/web3'

import getWeb3, { getPublicWeb3, StreamrWeb3 } from '../web3/web3Provider'
import TransactionError from '../errors/TransactionError'
import type {
    SmartContractCall,
    Address,
    SmartContractConfig,
    SmartContractTransaction,
} from '../flowtype/web3-types'
import type { EditProduct, SmartContractProduct } from '../flowtype/product-types'

import Transaction from './Transaction'
import { gasLimits } from './constants'

export type Callable = {
    call: () => SmartContractCall<*>,
}

export type Sendable = {
    send: ({
        from: Address,
    }) => PromiEvent,
}

export const areAddressesEqual = (first: Address, second: Address) => first.toLowerCase() === second.toLowerCase()

export const hexEqualsZero = (hex: string): boolean => /^(0x)?0+$/.test(hex)

export const getPrefixedHexString = (hex: string): string => hex.replace(/^0x|^/, '0x')

export const getUnprefixedHexString = (hex: string): string => hex.replace(/^0x|^/, '')

/**
 * Tells if the given string is valid hex or not.
 * @param hex string to validate. Can have the 0x prefix or not
 * @returns {boolean}
 */
export const isValidHexString = (hex: string): boolean => (typeof hex === 'string' || hex instanceof String) && web3Utils.isHex(hex)

export const getContract = ({ abi, address }: SmartContractConfig, usePublicNode: boolean = false): StreamrWeb3.eth.Contract => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    return new web3.eth.Contract(abi, address)
}

export const isUpdateContractProductRequired = (contractProduct: SmartContractProduct, editProduct: EditProduct) => (
    isPaidProduct(editProduct) &&
    (!arePricesEqual(contractProduct.pricePerSecond, editProduct.pricePerSecond) ||
    !areAddressesEqual(contractProduct.beneficiaryAddress, editProduct.beneficiaryAddress) ||
    contractProduct.priceCurrency !== editProduct.priceCurrency)
)

export const call = (method: Callable): SmartContractCall<*> => method.call()

export const send = (method: Sendable, options?: {
    gas?: number,
}): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    Promise.all([
        web3.getDefaultAccount(),
        checkEthereumNetworkIsCorrect(web3),
    ])
        .then(([account]) => {
            const sentMethod = method
                .send({
                    gas: (options && options.gas) || gasLimits.DEFAULT,
                    from: account,
                })
                .on('error', errorHandler)
                .on('transactionHash', (hash) => {
                    sentMethod.off('error', errorHandler)
                    sentMethod.on('error', (error, receipt) => {
                        errorHandler(new TransactionError(error.message, receipt))
                    })
                    emitter.emit('transactionHash', hash)
                })
                .on('receipt', (receipt) => {
                    if (parseInt(receipt.status, 16) === 0) {
                        errorHandler(new TransactionError(I18n.t('error.txFailed'), receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
        }, errorHandler)

    return tx
}
