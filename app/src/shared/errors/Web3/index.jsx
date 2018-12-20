// @flow

export class Web3NotSupportedError extends Error {
    __proto__: any

    constructor(message: string = 'Web3 not supported') {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = Web3NotSupportedError.prototype // eslint-disable-line no-proto
    }
}

export class Web3NotEnabledError extends Error {
    __proto__: any

    constructor(message: string = 'Web3 is not enabled') {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = Web3NotEnabledError.prototype // eslint-disable-line no-proto
    }
}

export class WalletLockedError extends Error {
    __proto__: any

    constructor(message: string = 'Wallet is locked') {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = WalletLockedError.prototype // eslint-disable-line no-proto
    }
}

export class WrongNetworkSelectedError extends Error {
    __proto__: any

    constructor(message: string = 'Wrong network selected') {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = WalletLockedError.prototype // eslint-disable-line no-proto
    }
}

export default {
    Web3NotSupportedError,
    Web3NotEnabledError,
    WalletLockedError,
    WrongNetworkSelectedError,
}
