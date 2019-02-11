// @flow

export default class CsvSchemaError extends Error {
    __proto__: any

    constructor(message: string) {
        super(message)
        this.__proto__ = CsvSchemaError.prototype // eslint-disable-line no-proto
    }
}
