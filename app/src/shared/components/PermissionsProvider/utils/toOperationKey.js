export default function toOperationKey(o) {
    return o.replace(/^can/i, '').toUpperCase()
}
