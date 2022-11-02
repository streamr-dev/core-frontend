export default class Web3NotEnabledError extends Error {
    name = 'Web3NotEnabledError'

    constructor() {
        super('Please unlock your wallet or enable access to your account')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Web3NotEnabledError)
        }

        Object.setPrototypeOf(this, Web3NotEnabledError.prototype)
    }
}
