// @flow

import BN from 'bignumber.js'

export default class NoBalanceError extends Error {
    __proto__: any
    requiredEthBalance: BN
    currentEthBalance: BN
    requiredDataBalance: BN
    currentDataBalance: BN

    constructor(
        message: string,
        requiredEthBalance: BN,
        currentEthBalance: BN,
        requiredDataBalance: BN,
        currentDataBalance: BN,
    ) {
        super(message)
        this.requiredEthBalance = requiredEthBalance
        this.currentEthBalance = currentEthBalance
        this.requiredDataBalance = requiredDataBalance
        this.currentDataBalance = currentDataBalance

        // This is because of some bug in babel
        this.__proto__ = NoBalanceError.prototype // eslint-disable-line no-proto
    }

    getRequiredEthBalance(): BN {
        return this.requiredEthBalance
    }

    getCurrentEthBalance(): BN {
        return this.currentEthBalance
    }

    getRequiredDataBalance(): BN {
        return this.requiredDataBalance
    }

    getCurrentDataBalance(): BN {
        return this.currentDataBalance
    }
}
