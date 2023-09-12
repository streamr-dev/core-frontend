export class DraftValidationError<T extends string> extends Error {
    name = 'DraftValidationError'

    constructor(readonly key: T, readonly message: string) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DraftValidationError)
        }

        Object.setPrototypeOf(this, DraftValidationError.prototype)
    }
}
