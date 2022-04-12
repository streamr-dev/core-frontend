export default class MissingNetworkError extends Error {
    name = 'MissingNetworkError'

    networkId

    constructor(networkId) {
        super(`Network "${networkId}" is missing!`)

        this.networkId = networkId

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingNetworkError)
        }

        Object.setPrototypeOf(this, MissingNetworkError.prototype)
    }
}
