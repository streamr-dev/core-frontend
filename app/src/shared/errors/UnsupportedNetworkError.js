export default class UnsupportedNetworkError extends Error {
    name = 'UnsupportedNetworkError'

    networkId

    constructor(networkId) {
        super(`Network id "${networkId}" is not supported!`)

        this.networkId = networkId

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnsupportedNetworkError)
        }

        Object.setPrototypeOf(this, UnsupportedNetworkError.prototype)
    }
}
