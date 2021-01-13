export default function toOperationKey(o) {
    return o.toUpperCase().split(/_/).reverse()[0]
}
