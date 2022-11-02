export default class InsufficientFundsError extends Error {
    name = 'InsufficientFundsError'

    constructor(address) {
        super(`"${address}" does not have enough funds to cover the cost of gas`)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InsufficientFundsError)
        }

        Object.setPrototypeOf(this, InsufficientFundsError.prototype)
    }
}
