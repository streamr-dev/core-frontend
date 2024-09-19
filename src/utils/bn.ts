import BN from 'bignumber.js'
import { BigNumberish } from 'ethers'

export type BNish = number | string | BN | BigNumberish

export { BN }

export function toBN(value: BNish): BN {
    return typeof value === 'bigint' ? toBN(value.toString()) : new BN(value)
}

export function toBigInt(value: Exclude<BNish, bigint>, decimals = 0n): bigint {
    try {
        return BigInt(
            toBN(value)
                .multipliedBy(toBN(10n ** decimals))
                .toFixed(0),
        )
    } catch (e) {
        console.warn('Failed to convert BigNumberish value to BigInt. Using 0n.', value)
    }

    return 0n
}

export function toFloat(value: bigint, decimals: bigint): BN {
    return toBN(value).dividedBy(toBN(10n ** decimals))
}
