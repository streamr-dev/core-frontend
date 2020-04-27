// @flow

import EventEmitter from 'events'
import type { PromiEvent } from 'web3'
import { I18n } from 'react-redux-i18n'
import { isHex } from 'web3-utils'
import { generateAddress, bufferToHex } from 'ethereumjs-util'
import BN from 'bignumber.js'

import { arePricesEqual } from '../utils/price'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'

import getWeb3, { getPublicWeb3, StreamrWeb3 } from '$shared/web3/web3Provider'
import TransactionError from '$shared/errors/TransactionError'
import type {
    SmartContractCall,
    Address,
    SmartContractConfig,
    SmartContractTransaction,
    SmartContractDeployTransaction,
    SmartContractMetadata,
} from '$shared/flowtype/web3-types'
import type { Product, SmartContractProduct } from '../flowtype/product-types'
import type { NumberString } from '$shared/flowtype/common-types'

import Transaction from '$shared/utils/Transaction'
import DeployTransaction from '$shared/utils/DeployTransaction'
import { gasLimits } from '$shared/utils/constants'

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

export const calculateContractAddress = async (account: Address): Promise<Address> => {
    const web3 = getWeb3()
    const currentNonce = await web3.eth.getTransactionCount(account)

    if (!Number.isInteger(currentNonce)) {
        throw new Error('Could not calculate address')
    }

    const futureAddress = bufferToHex(generateAddress(account, currentNonce))
    return futureAddress
}

/**
 * Tells if the given string is valid hex or not.
 * @param hex string to validate. Can have the 0x prefix or not
 * @returns {boolean}
 */
export const isValidHexString = (hex: string): boolean => (typeof hex === 'string' || hex instanceof String) && isHex(hex)

export const getContract = ({ abi, address }: SmartContractConfig, usePublicNode: boolean = false): StreamrWeb3.eth.Contract => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
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
}): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        console.warn(error)
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    Promise.all([
        web3.getDefaultAccount(),
        checkEthereumNetworkIsCorrect(web3),
    ])
        .then(([account]) => {
            method.send({
                gas: (options && options.gas) || gasLimits.DEFAULT,
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
                        errorHandler(new TransactionError(I18n.t('error.txFailed'), receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
                .catch(errorHandler)
        }, errorHandler)

    return tx
}

export const deploy = (contract: SmartContractMetadata, args: Array<any>, options?: {
    gas?: number,
}): SmartContractDeployTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new DeployTransaction(emitter)
    Promise.all([
        web3.getDefaultAccount(),
        checkEthereumNetworkIsCorrect(web3),
    ])
        .then(([account]) => Promise.all([
            Promise.resolve(account),
            // Calculate future address of the contract so that we don't have to wait
            // for the transaction to be confirmed.
            calculateContractAddress(account),
        ]))
        .then(([account, futureAddress]) => {
            const web3Contract = new web3.eth.Contract(contract.abi)
            const deployer = web3Contract.deploy({
                data: contract.bytecode,
                arguments: args,
            })
            deployer
                .send({
                    gas: (options && options.gas) || gasLimits.DEPLOY_DATA_UNION,
                    from: account,
                })
                .on('error', errorHandler)
                .on('transactionHash', (hash) => {
                    emitter.emit('transactionHash', hash, futureAddress)
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
