import * as operations from '../operations'

export default function lookup(combination, operationKey) {
    // eslint-disable-next-line no-bitwise
    return !!(combination & operations[operationKey])
}
