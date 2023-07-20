import { providers } from 'ethers'

export default class TransactionError extends Error {
    receipt: providers.TransactionReceipt | null | undefined
    __proto__: any

    constructor(message: string, receipt?: providers.TransactionReceipt) {
        super(message)
        this.receipt = receipt
        // This is because of some bug in babel
        this.__proto__ = TransactionError.prototype // eslint-disable-line no-proto
    }

    getReceipt(): providers.TransactionReceipt | null | undefined {
        return this.receipt
    }
}
