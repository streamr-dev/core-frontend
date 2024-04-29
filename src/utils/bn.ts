import BN from 'bignumber.js'
import { BigNumberish } from 'ethers'

export type BNish = number | string | BN | BigNumberish

export { BN }

export function toBN(value: BNish) {
    if (typeof value === 'bigint') {
        return toBN(value.toString())
    }

    return new BN(value)
}
