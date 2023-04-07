export default class ValidationError extends Error {
    name = 'ValidationError'

    constructor(message: string) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError)
        }

        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}
