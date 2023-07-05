export default class TransactionRejectedError extends Error {
    name = 'TransactionRejectedError'

    constructor() {
        super('Transaction rejected by user')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransactionRejectedError)
        }

        Object.setPrototypeOf(this, TransactionRejectedError.prototype)
    }
}
