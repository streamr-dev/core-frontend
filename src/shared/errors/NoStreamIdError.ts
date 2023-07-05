export default class NoStreamIdError extends Error {
    name = 'NoStreamIdError'

    constructor() {
        super('No stream id')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoStreamIdError)
        }

        Object.setPrototypeOf(this, NoStreamIdError.prototype)
    }
}
