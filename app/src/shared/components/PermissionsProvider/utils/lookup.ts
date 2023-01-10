import { Operation, getOperationWithName, checkOperation } from '../operations'

export default function lookup(combination: Operation, operationKey: string): boolean {
    const enumKey = getOperationWithName(operationKey)
    return checkOperation(combination, enumKey)
}