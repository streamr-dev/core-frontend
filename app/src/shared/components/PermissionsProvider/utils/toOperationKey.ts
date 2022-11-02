export default function toOperationKey(o: string): string {
    return o.replace(/^can/i, '').toUpperCase()
}
