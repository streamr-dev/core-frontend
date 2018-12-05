// @flow

import type EventEmitter from 'events'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type TransactionError from '../../errors/TransactionError'

export default class Transaction {
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

    onError = (cb: (error: TransactionError) => void) => {
        this.emitter.on('error', cb)
        return this
    }
}
