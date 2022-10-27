import { TransactionReceipt } from 'web3-core'

export default class TransactionError extends Error {
    receipt: TransactionReceipt | null | undefined
    __proto__: any

    constructor(message: string, receipt?: TransactionReceipt) {
        super(message)
        this.receipt = receipt
        // This is because of some bug in babel
        this.__proto__ = TransactionError.prototype // eslint-disable-line no-proto
    }

    getReceipt(): TransactionReceipt | null | undefined {
        return this.receipt
    }
}
