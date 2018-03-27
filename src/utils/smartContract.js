// @flow
import EventEmitter from 'events'
import getWeb3 from '../web3/web3Provider'

import type {PromiEvent} from 'web3'
import type {SmartContractCall, Receipt, Address, Abi, Hash, SmartContractTransaction} from '../flowtype/web3-types'

type Callable = {
    call: () => SmartContractCall,
}

type Sendable = {
    send: ({
        from: Address
    }) => PromiEvent,
}

export const getContract = (address: Address, abi: Abi) => {
    const web3 = getWeb3()
    return new web3.eth.Contract(abi, address, {
        gas: 200000
    })
}

export class TransactionFailedError extends Error {
    receipt: Receipt
    __proto__: any

    constructor(message: string, receipt: Receipt) {
        super(message)
        this.receipt = receipt

        // This is because of some bug in babel
        this.__proto__ = TransactionFailedError.prototype
    }

    getReceipt() {
        return this.receipt
    }
}

export class Transaction {
    emitter: EventEmitter

    constructor(emitter: EventEmitter) {
        this.emitter = emitter
    }

    onTransactionHash = (cb: (Hash) => void) => {
        this.emitter.on('transactionHash', cb)
        return this
    }

    onTransactionComplete = (cb: (Receipt) => void) => {
        this.emitter.on('receipt', cb)
        return this
    }

    onError = (cb: (error: Error, receipt?: Receipt) => void) => {
        this.emitter.on('error', cb)
        return this
    }
}

export const call = (method: Callable): SmartContractCall => method.call()

export const send = (method: Sendable): SmartContractTransaction => {
    const web3 = getWeb3()
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    const tx = new Transaction(emitter)
    web3.getDefaultAccount()
        .then((account: Address) => {
            const sentMethod = method.send({
                from: account
            })
                .on('error', errorHandler)
                .on('transactionHash', (hash) => {
                    sentMethod.off('error', errorHandler)
                    sentMethod.on('error', (error, receipt) => {
                        errorHandler(new TransactionFailedError(error.message, receipt))
                    })
                    emitter.emit('transactionHash', hash)
                })
                .on('receipt', (receipt) => {
                    if (parseInt(receipt.status, 16) === 0) {
                        errorHandler(new TransactionFailedError('Transaction failed', receipt))
                    } else {
                        emitter.emit('receipt', receipt)
                    }
                })
        })
        .catch(errorHandler)

    return tx
}
