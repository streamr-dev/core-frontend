import toOperationKey from './toOperationKey'

export default function toOperationName(resourceType, o) {
    return `${resourceType}_${toOperationKey(o)}`.toLowerCase()
}
