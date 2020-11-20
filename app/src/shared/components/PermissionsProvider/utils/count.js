export default function count(combination) {
    let sum = 0

    let c = combination

    while (c > 0) {
        // eslint-disable-next-line no-bitwise
        sum += c & 1
        // eslint-disable-next-line no-bitwise
        c >>= 1
    }

    return sum
}
