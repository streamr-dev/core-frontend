export default class OperationNotPermittedError extends Error {
    name = 'OperationNotPermittedError'

    constructor(operation) {
        super(`Operation "${operation}" not permitted`)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OperationNotPermittedError)
        }

        Object.setPrototypeOf(this, OperationNotPermittedError.prototype)
    }
}
