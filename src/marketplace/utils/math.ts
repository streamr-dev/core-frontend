import { toBN, BNish, BN } from '~/utils/bn'

export function toAtto(value: BNish) {
    return toDecimals(value, 18)
}

export function fromAtto(value: BNish) {
    return fromDecimals(value, 18)
}

export function toDecimals(value: BNish, decimals: BNish) {
    return toBN(value)
        .multipliedBy(toBN(10).pow(toBN(decimals)))
        .dp(0, BN.ROUND_HALF_UP)
}

export function fromDecimals(value: BNish, decimals: BNish) {
    return toBN(value).div(toBN(10).pow(toBN(decimals)))
}
