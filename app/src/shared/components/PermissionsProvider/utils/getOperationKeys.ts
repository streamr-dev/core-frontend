import { Operation, checkOperation, getOperationNames }from '../operations'

export default function getOperationKeys(combination: Operation): Operation[] {
    const operationKeys = getOperationNames()
    return operationKeys.reduce(
        (
            memo,
            operationKey, // eslint-disable-next-line no-bitwise
        ) => (checkOperation(combination, Operation[operationKey]) ? [...memo, operationKey] : memo),
        [],
    )
}
