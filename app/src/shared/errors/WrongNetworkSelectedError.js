export default class WrongNetworkSelectedError extends Error {
    requiredNetwork

    currentNetwork

    constructor(requiredNetwork, currentNetwork) {
        super(`Network #${requiredNetwork} is required, currently #${currentNetwork || 'N/A'} selected.`)

        this.requiredNetwork = requiredNetwork

        this.currentNetwork = currentNetwork

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WrongNetworkSelectedError)
        }

        Object.setPrototypeOf(this, WrongNetworkSelectedError.prototype)
    }
}
