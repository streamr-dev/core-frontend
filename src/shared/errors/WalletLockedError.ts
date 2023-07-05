export default class WalletLockedError extends Error {
    name = 'WalletLockedError'

    constructor() {
        super('Please unlock your wallet')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WalletLockedError)
        }

        Object.setPrototypeOf(this, WalletLockedError.prototype)
    }
}
