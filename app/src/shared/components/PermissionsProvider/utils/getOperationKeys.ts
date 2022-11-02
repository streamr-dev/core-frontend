import * as operations from '../operations'
// TODO add typing
export default function getOperationKeys(combination: any): any {
    return Object.keys(operations).reduce(
        (
            memo,
            operationKey, // eslint-disable-next-line no-bitwise
        ) => (combination & (operations as {[key: string]: number})[operationKey] ? [...memo, operationKey] : memo),
        [],
    )
}
