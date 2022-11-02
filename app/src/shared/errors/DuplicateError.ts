export default class DuplicateError extends Error {
    name = 'DuplicateError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DuplicateError)
        }

        Object.setPrototypeOf(this, DuplicateError.prototype)
    }
}
