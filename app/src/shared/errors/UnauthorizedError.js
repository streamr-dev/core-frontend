// @flow

export default class UnauthorizedError extends Error {
    name: string = 'UnauthorizedError'

    constructor() {
        super()

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnauthorizedError)
        }

        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}
