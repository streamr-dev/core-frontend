// @flow

export default class InvalidHexStringError extends Error {
    id: ?string

    name: string = 'InvalidHexStringError'

    constructor(id: ?string, ...args: any) {
        super(`"${id || ''}" is not a valid hex string`, ...args)

        this.id = id

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidHexStringError)
        }

        Object.setPrototypeOf(this, InvalidHexStringError.prototype)
    }
}
