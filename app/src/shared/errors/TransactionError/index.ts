import type { Receipt } from '../../flowtype/web3-types'
export default class TransactionError extends Error {
    receipt: Receipt | null | undefined
    __proto__: any

    constructor(message: string, receipt?: Receipt) {
        super(message)
        this.receipt = receipt
        // This is because of some bug in babel
        this.__proto__ = TransactionError.prototype // eslint-disable-line no-proto
    }

    getReceipt(): Receipt | null | undefined {
        return this.receipt
    }
}
