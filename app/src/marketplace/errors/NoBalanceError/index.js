// @flow

import BN from 'bignumber.js'

export type Required = {
    gas: BN,
    eth?: BN,
    data?: BN,
    dai?: BN,
}

export type Balances = {
    eth: BN,
    data?: BN,
    dai?: BN,
}

type Constructor = {
    message: string,
    required: Required,
    balances: Balances,
}

export default class NoBalanceError extends Error {
    __proto__: any
    required: Required
    balances: Balances

    constructor({ message, required, balances }: Constructor) {
        super(message)
        this.required = required
        this.balances = balances

        // This is because of some bug in babel
        this.__proto__ = NoBalanceError.prototype // eslint-disable-line no-proto
    }

    getRequired(): Required {
        return this.required
    }

    getBalances(): Balances {
        return this.balances
    }
}
