// @flow

import { I18n } from 'react-redux-i18n'

export class Web3NotSupportedError extends Error {
    constructor(message: string = 'Web3 not supported', ...args: any[]) {
        super(message, ...args)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Web3NotSupportedError)
        }

        // This is because of some bug in babel (https://github.com/babel/babel/issues/4485)
        Object.setPrototypeOf(this, Web3NotSupportedError.prototype)
    }
}

export class Web3NotEnabledError extends Error {
    constructor(message: string = I18n.t('shared.errors.web3NotEnabled'), ...args: any[]) {
        super(message, ...args)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Web3NotEnabledError)
        }

        Object.setPrototypeOf(this, Web3NotEnabledError.prototype)
    }
}

export class WalletLockedError extends Error {
    constructor(message: string = I18n.t('shared.errors.unlockWallet'), ...args: any[]) {
        super(message, ...args)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Web3NotEnabledError)
        }

        Object.setPrototypeOf(this, WalletLockedError.prototype)
    }
}

export class WrongNetworkSelectedError extends Error {
    constructor(requiredNetworkName: string, currentNetworkName: string, ...args: any[]) {
        super(I18n.t('shared.errors.incorrectEthereumNetwork', {
            requiredNetworkName,
            currentNetworkName,
        }), ...args)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WrongNetworkSelectedError)
        }

        Object.setPrototypeOf(this, WrongNetworkSelectedError.prototype)
    }
}

export default {
    Web3NotSupportedError,
    Web3NotEnabledError,
    WalletLockedError,
    WrongNetworkSelectedError,
}
