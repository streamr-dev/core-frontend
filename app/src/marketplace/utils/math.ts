import BN from 'bignumber.js'
export const toNano = (num: string | BN | number): BN => new BN(num).multipliedBy(1e9)
export const fromNano = (num: string | BN | number): BN => new BN(num).dividedBy(1e9)
export const toAtto = (num: string | BN | number): BN => new BN(num).multipliedBy(1e18)
export const fromAtto = (num: string | BN | number): BN => new BN(num).dividedBy(1e18)
export const toDecimals = (num: string | BN, decimals: string | BN | number): BN =>
    new BN(num).multipliedBy(new BN(10).pow(new BN(decimals).toNumber()))
export const fromDecimals = (num: string | BN, decimals: string | BN | number): BN =>
    new BN(num).dividedBy(new BN(10).pow(new BN(decimals).toNumber()))
