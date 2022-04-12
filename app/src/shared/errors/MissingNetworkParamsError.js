export default class MissingNetworkParamsError extends Error {
    name = 'MissingNetworkParamsError'

    networkId

    constructor(networkId) {
        super(`Missing params for network "${networkId}"`)

        this.networkId = networkId

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MissingNetworkParamsError)
        }

        Object.setPrototypeOf(this, MissingNetworkParamsError.prototype)
    }
}
