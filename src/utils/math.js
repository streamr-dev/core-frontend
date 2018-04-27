// @flow

import BN from 'bignumber.js'

export const toNanoString = (num: number) => BN(num).multipliedBy(1e9).toString()

export const fromNano = (num: string | number) => BN(num).dividedBy(1e9).toNumber()

export const toAttoString = (num: number) => BN(num).multipliedBy(1e18).toString()

export const fromAtto = (num: string | number) => BN(num).dividedBy(1e18).toNumber()
