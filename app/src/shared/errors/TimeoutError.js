export default class TimeoutError extends Error {
    name = 'TimeoutError'

    constructor() {
        super('Timeout')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TimeoutError)
        }

        Object.setPrototypeOf(this, TimeoutError.prototype)
    }
}
