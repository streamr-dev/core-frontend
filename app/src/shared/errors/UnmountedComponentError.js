export default class UnmountedComponentError extends Error {
    name = 'UnmountedComponentError'

    constructor() {
        super('Component is no longer mounted')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnmountedComponentError)
        }

        Object.setPrototypeOf(this, UnmountedComponentError.prototype)
    }
}
