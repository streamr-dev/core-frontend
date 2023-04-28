export default class StreamNotFoundError extends Error {
    name = 'StreamNotFoundError'

    constructor(readonly streamId: string) {
        super('Stream not found')

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, StreamNotFoundError)
        }

        Object.setPrototypeOf(this, StreamNotFoundError.prototype)
    }
}
