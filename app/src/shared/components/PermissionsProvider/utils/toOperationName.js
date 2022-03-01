import toOperationKey from './toOperationKey'

export default function toOperationName(o) {
    return toOperationKey(o).toLowerCase()
}
