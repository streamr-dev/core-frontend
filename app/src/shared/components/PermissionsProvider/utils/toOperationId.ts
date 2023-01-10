import { Operation, getOperationWithName } from '../operations'
import toOperationKey from './toOperationKey'
export default function toOperationID(o: string): Operation {
    const opKey = toOperationKey(o)
    return getOperationWithName(opKey)
}
