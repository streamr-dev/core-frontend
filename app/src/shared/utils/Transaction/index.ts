import type EventEmitter from 'events'
import type { Hash, Receipt } from '$shared/types/web3-types'
import type TransactionError from '$shared/errors/TransactionError'
export default class Transaction {

    constructor(private emitter: EventEmitter) {}

    onTransactionHash(cb: (arg0: Hash) => void): Transaction {
        this.emitter.on('transactionHash', cb)
        return this
    }
    onTransactionComplete(cb: (arg0: Receipt) => void): Transaction {
        this.emitter.on('receipt', cb)
        return this
    }
    onError(cb: (error: TransactionError) => void): Transaction {
        this.emitter.on('error', cb)
        return this
    }
}
