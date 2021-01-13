import * as operations from '../operations'

export default function getOperationKeys(combination) {
    return Object.keys(operations).reduce((memo, operationKey) => (
        // eslint-disable-next-line no-bitwise
        combination & operations[operationKey] ? [...memo, operationKey] : memo
    ), [])
}
