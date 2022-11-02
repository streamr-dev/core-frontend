import toOperationKey from './toOperationKey'
export default function toOperationName(o: string): string {
    return toOperationKey(o).toLowerCase()
}
