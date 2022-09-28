// @flow

import BN from 'bignumber.js'

export const toNano = (num: string | BN): BN => BN(num).multipliedBy(1e9)

export const fromNano = (num: string | BN): BN => BN(num).dividedBy(1e9)

export const toAtto = (num: string | BN): BN => BN(num).multipliedBy(1e18)

export const fromAtto = (num: string | BN): BN => BN(num).dividedBy(1e18)

export const toDecimals = (num: string | BN, decimals: string | BN): BN => BN(num).multipliedBy(BN(10).pow(decimals))

export const fromDecimals = (num: string | BN, decimals: string | BN): BN => BN(num).dividedBy(BN(10).pow(decimals))
