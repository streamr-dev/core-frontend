// @flow

import type EventEmitter from 'events'
import type { Hash, Receipt, Address } from '$shared/flowtype/web3-types'
import type TransactionError from '$shared/errors/TransactionError'

export default class DeployTransaction {
    emitter: EventEmitter

    constructor(emitter: EventEmitter) {
        this.emitter = emitter
    }

    onTransactionHash = (cb: (Hash) => void) => {
        this.emitter.on('transactionHash', cb)
        return this
    }

    onContractAddress = (cb: (Address) => void) => {
        this.emitter.on('contractAddress', cb)
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
