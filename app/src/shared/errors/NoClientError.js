export default class NoClientError extends Error {
    name = 'NoClientError'

    constructor() {
        super('No client')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoClientError)
        }

        Object.setPrototypeOf(this, NoClientError.prototype)
    }
}
