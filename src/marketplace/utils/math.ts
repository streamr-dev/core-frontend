import { toBN, BNish } from '~/utils/bn'

export function toNano(value: BNish) {
    return toDecimals(value, 9)
}

export function fromNano(value: BNish) {
    return fromDecimals(value, 9)
}

export function toAtto(value: BNish) {
    return toDecimals(value, 18)
}

export function fromAtto(value: BNish) {
    return fromDecimals(value, 18)
}

export function toDecimals(value: BNish, decimals: BNish) {
    return toBN(value).multipliedBy(toBN(10).pow(toBN(decimals)))
}

export function fromDecimals(value: BNish, decimals: BNish) {
    return toBN(value).div(toBN(10).pow(toBN(decimals)))
}
