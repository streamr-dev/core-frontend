// @flow

import ee from 'event-emitter'
import type { TxHash, Receipt, PurchaseError, TxHashError } from '../flowtype/web3-types'

type Emitter = {
    on: (string, Function) => void,
}

export class Transaction {
    emitter: Emitter

    constructor(emitter: any) {
        this.emitter = emitter
    }

    onTransactionHash = (cb: (TxHash) => void) => {
        this.emitter.on('transactionHash', cb)
        return this
    }

    onTransactionMined = (cb: (Receipt) => void) => {
        this.emitter.on('receipt', cb)
        return this
    }

    onError = (cb: (error: PurchaseError | TxHashError, receipt?: Receipt) => void) => {
        this.emitter.on('error', cb)
        return this
    }
}

export const buy = (/* id: ProductId */) => {
    const emitter = ee()
    setTimeout(() => {
        emitter.emit('transactionHash', '0x37cd5542aa218fe021facc817b25f7f5de6398df6ce4e4fab5d59290a2a22cdz')
    }, 1000)
    setTimeout(() => {
        emitter.emit('receipt', {
            transactionHash: '0x37cd5542aa218fe021facc817b25f7f5de6398df6ce4e4fab5d59290a2a22cdz',
            // …
            gasUsed: 30234,
        })
    }, 3000)
    return emitter
}
