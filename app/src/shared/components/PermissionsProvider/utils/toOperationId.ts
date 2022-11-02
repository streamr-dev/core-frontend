import * as operations from '../operations'
import toOperationKey from './toOperationKey'
export default function toOperationID(o: string): number {
    return (operations as {[key: string]: number})[toOperationKey(o)]
}
