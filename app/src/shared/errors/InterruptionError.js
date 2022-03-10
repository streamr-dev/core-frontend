export default class InterruptionError extends Error {
    name = 'InterruptionError'

    constructor() {
        super('Conditions changed')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InterruptionError)
        }

        Object.setPrototypeOf(this, InterruptionError.prototype)
    }
}
