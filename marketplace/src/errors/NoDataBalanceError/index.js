// @flow

export default class NoDataBalanceError extends Error {
    __proto__: any

    constructor(message: string) {
        super(message)

        // This is because of some bug in babel
        this.__proto__ = NoDataBalanceError.prototype // eslint-disable-line no-proto
    }
}
