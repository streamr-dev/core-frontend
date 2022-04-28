export default class Web3NotSupportedError extends Error {
    name = 'Web3NotSupportedError'

    constructor() {
        super('Web3 not supported')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Web3NotSupportedError)
        }

        Object.setPrototypeOf(this, Web3NotSupportedError.prototype)
    }
}
