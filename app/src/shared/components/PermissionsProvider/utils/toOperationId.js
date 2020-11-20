import * as operations from '../operations'
import toOperationKey from './toOperationKey'

export default function toOperationID(o) {
    return operations[toOperationKey(o)]
}
