export default class StaleError extends Error {
    name = 'StaleError'

    constructor() {
        super('Conditions changed')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, StaleError)
        }

        Object.setPrototypeOf(this, StaleError.prototype)
    }
}
