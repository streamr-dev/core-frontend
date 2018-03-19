// @flow

import type { Web3, PromiEvent } from 'web3'
import type { SmartContractCall, Receipt } from '../flowtype/web3-types'
import EventEmitter from 'events'

type Callable = {
    call: () => SmartContractCall,
}

type Sendable = {
    send: () => PromiEvent,
}

export const getContract = (web3: Web3, address: string, abi: Array<{}>) => web3.getDefaultAccount()
    .then(account => new web3.eth.Contract(abi, address, {
        from: account,
        gas: 200000
    }))

export class TransactionFailedError extends Error {
    receipt: Receipt
    __proto__: any
    constructor(message: string, receipt: Receipt) {
        super(message)
        this.receipt = receipt

        // This is because of some bug in babel
        // eslint-disable-next-line
        this.__proto__   = TransactionFailedError.prototype
    }
    getReceipt() {
        return this.receipt
    }
}

export const call = (method: () => Promise<Callable>): any => method().then(m => m.call())

export const send = (method: () => Promise<Sendable>): any => {
    const emitter = new EventEmitter()
    const errorHandler = (error: Error) => {
        emitter.emit('error', error)
    }
    method()
        .then((sendableMethod: Sendable) => {
            const sentMethod = sendableMethod.send()
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
                        emitter.emit('transactionComplete', receipt)
                    }
                })
        })

    return emitter
}
