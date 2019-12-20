// @flow

import BN from 'bignumber.js'

export default class NoBalanceError extends Error {
    __proto__: any
    requiredGasBalance: BN
    requiredEthBalance: BN
    currentEthBalance: BN
    requiredDataBalance: BN
    currentDataBalance: BN
    currentDaiBalance: BN
    requiredDaiBalance: BN

    constructor(
        message: string,
        requiredGasBalance: BN,
        requiredEthBalance: BN,
        currentEthBalance: BN,
        requiredDataBalance: BN,
        currentDataBalance: BN,
        currentDaiBalance: BN,
        requiredDaiBalance: BN,
    ) {
        super(message)
        this.requiredGasBalance = requiredGasBalance
        this.requiredEthBalance = requiredEthBalance
        this.currentEthBalance = currentEthBalance
        this.requiredDataBalance = requiredDataBalance
        this.currentDataBalance = currentDataBalance
        this.currentDaiBalance = currentDaiBalance
        this.requiredDaiBalance = requiredDaiBalance

        // This is because of some bug in babel
        this.__proto__ = NoBalanceError.prototype // eslint-disable-line no-proto
    }

    getRequiredGasBalance(): BN {
        return this.requiredGasBalance
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

    getCurrentDaiBalance(): BN {
        return this.currentDaiBalance
    }

    getRequiredDaiBalance(): BN {
        return this.requiredDaiBalance
    }
}
