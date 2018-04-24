// @flow

import BN from 'bignumber.js'

import type { TimeUnit, Currency } from '../flowtype/common-types'

import { timeUnits, currencies } from './constants'
import { toSeconds } from './time'

export const toNanoDollarString = (dollars: number) => new BN(dollars).multipliedBy(1e9).toString()

export const fromNanoDollars = (nanoDollars: string | number) => ( // It's safer to call this with a string
    new BN(nanoDollars).dividedBy(1e9).toNumber()
)

export const priceForTimeUnits = (pricePerSecond: number, timeAmount: number, timeUnit: TimeUnit): number => {
    const seconds = toSeconds(timeAmount, timeUnit)
    return pricePerSecond * seconds
}

export const pricePerSecondFromTimeUnit = (pricePerTimeUnit: number, timeUnit: TimeUnit): number => (
    new BN(pricePerTimeUnit.toString())
        .dividedBy(toSeconds(1, timeUnit))
        .toNumber()
)

export const getMostRelevantTimeUnit = (pricePerSecond: number): TimeUnit => {
    // Go from smallest time unit to the largest and see when we get a value bigger than 1.
    // This should be the most relevant unit for the user.
    const guesses = Object
        .keys(timeUnits)
        .filter((unit) => pricePerSecond * toSeconds(1, unit) >= 1)

    return guesses[0] || timeUnits.second
}

export const formatPrice = (pricePerSecond: number, currency: Currency, digits?: number, timeUnit?: TimeUnit): string => {
    const actualTimeUnit = timeUnit || getMostRelevantTimeUnit(pricePerSecond)
    const price = priceForTimeUnits(pricePerSecond, 1, actualTimeUnit)
    const roundedPrice = digits !== undefined ? price.toFixed(digits) : price
    return `${roundedPrice} ${currency} per ${actualTimeUnit}`
}

/**
 * Convert DATA to USD.
 * @param data Number of DATA to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 */
export const dataToUsd = (data: number, dataPerUsd: number) => BN(data.toString())
    .dividedBy(dataPerUsd.toString())
    .toNumber()

/**
 * Convert USD to DATA.
 * @param usd Number of USD to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 */
export const usdToData = (usd: number, dataPerUsd: number) => BN(usd.toString())
    .multipliedBy(dataPerUsd.toString())
    .toNumber()

/**
 * Convert amount between fromCurrency and toCurrency.
 * @param amount Amount of units to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 * @param fromCurrency Input currency.
 * @param toCurrency Output currency.
 */
export const convert = (amount: number, dataPerUsd: number, fromCurrency: Currency, toCurrency: Currency) => {
    if (fromCurrency === toCurrency) {
        return amount
    }
    const calc = fromCurrency === currencies.DATA ? dataToUsd : usdToData
    return calc(amount, dataPerUsd)
}

/**
 * Make sure the amount is a non-negative number.
 * @param amount Number to sanitize.
 */
export const sanitize = (amount: number): number => (Number.isNaN(amount) ? 0.0 : Math.max(0.0, amount))

/**
 * Limit the number of fraction digits.
 * @param value Amount to limit.
 * @param maxDigits Max. number of fraction digits.
 */
export const formatAmount = (value: number, maxDigits: ?number) => {
    if (typeof maxDigits === 'number' && maxDigits >= 0) {
        return parseFloat(sanitize(value).toFixed(maxDigits))
    }
    return value
}
