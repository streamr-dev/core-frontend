import { z } from 'zod'

export class DraftValidationError<T extends string = string> extends Error {
    name = 'DraftValidationError'

    constructor(readonly key: T, readonly message: string) {
        super(message)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DraftValidationError)
        }

        Object.setPrototypeOf(this, DraftValidationError.prototype)
    }
}

export class ValidationError extends Error {
    name = 'ValidationError'

    constructor(readonly messages: string[]) {
        super(messages.join(', '))

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError)
        }

        Object.setPrototypeOf(this, ValidationError.prototype)
    }
}

export class ParseError extends Error {
    name = 'ParseError'

    constructor(readonly entity: unknown, readonly error: z.ZodError) {
        super('Failed to parse')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ParseError)
        }

        Object.setPrototypeOf(this, ParseError.prototype)
    }
}
