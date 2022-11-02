export default class NoModalRootError extends Error {
    __proto__: any

    constructor() {
        super('Root element for modals is missing.')
        this.__proto__ = NoModalRootError.prototype // eslint-disable-line no-proto
    }
}
