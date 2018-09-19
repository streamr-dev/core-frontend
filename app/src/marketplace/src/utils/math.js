// @flow

import BN from 'bignumber.js'

export const toNano = (num: string | BN): BN => BN(num).multipliedBy(1e9)

export const fromNano = (num: string | BN): BN => BN(num).dividedBy(1e9)

export const toAtto = (num: string | BN): BN => BN(num).multipliedBy(1e18)

export const fromAtto = (num: string | BN): BN => BN(num).dividedBy(1e18)
