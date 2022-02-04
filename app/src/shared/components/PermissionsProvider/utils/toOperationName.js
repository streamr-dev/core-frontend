import toOperationKey from './toOperationKey'

export default function toOperationName(o) {
    return `can${toOperationKey(o).toLowerCase().replace(/^\w/, (s) => s.toUpperCase())}`
}
