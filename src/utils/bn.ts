import BN from 'bignumber.js'
import { BigNumber } from 'ethers'

export type BNish = number | string | BN | BigNumber

export { BN }

export function toBN(value: BNish) {
    if (value instanceof BigNumber) {
        return toBN(value.toString())
    }

    return new BN(value)
}
