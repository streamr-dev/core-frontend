// @flow

import { I18n } from 'react-redux-i18n'

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

    constructor(message: string = I18n.t('shared.errors.web3NotEnabled')) {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = Web3NotEnabledError.prototype // eslint-disable-line no-proto
    }
}

export class WalletLockedError extends Error {
    __proto__: any

    constructor(message: string = I18n.t('shared.errors.unlockWallet')) {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = WalletLockedError.prototype // eslint-disable-line no-proto
    }
}

export class WrongNetworkSelectedError extends Error {
    __proto__: any

    constructor(requiredNetworkName: string, currentNetworkName: string) {
        super(I18n.t('shared.errors.incorrectEthereumNetwork', {
            requiredNetworkName,
            currentNetworkName,
        }))

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
