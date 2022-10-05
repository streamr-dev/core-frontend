import type EventEmitter from 'events'
import type { Hash, Receipt } from '$shared/flowtype/web3-types'
import type TransactionError from '$shared/errors/TransactionError'
export default class Transaction {
    emitter: EventEmitter

    constructor(emitter: EventEmitter) {
        this.emitter = emitter
    }

    onTransactionHash = (cb: (arg0: Hash) => void) => {
        this.emitter.on('transactionHash', cb)
        return this
    }
    onTransactionComplete = (cb: (arg0: Receipt) => void) => {
        this.emitter.on('receipt', cb)
        return this
    }
    onError = (cb: (error: TransactionError) => void) => {
        this.emitter.on('error', cb)
        return this
    }
}
