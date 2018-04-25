// @flow

import BN from 'bignumber.js'

import type { TimeUnit, Currency } from '../flowtype/common-types'

import { timeUnits, currencies } from './constants'
import { toSeconds } from './time'

export const toNanoDollarString = (dollars: number | BN): string => BN(dollars).multipliedBy(1e9).toString()

export const fromNanoDollars = (nanoDollars: string | BN): BN => BN(nanoDollars).dividedBy(1e9)

export const priceForTimeUnits = (pricePerSecond: BN, timeAmount: BN, timeUnit: TimeUnit): BN => {
    const seconds = toSeconds(timeAmount, timeUnit)
    return pricePerSecond.multipliedBy(seconds)
}

export const getMostRelevantTimeUnit = (pricePerSecond: BN): TimeUnit => {
    // Go from smallest time unit to the largest and see when we get a value bigger than 1.
    // This should be the most relevant unit for the user.
    const guesses = Object
        .keys(timeUnits)
        .filter((unit) => toSeconds(1, unit).multipliedBy(pricePerSecond).isGreaterThanOrEqualTo(1))

    return guesses[0] || timeUnits.second
}

export const formatPrice = (pricePerSecond: BN, currency: Currency, digits?: number, timeUnit?: TimeUnit): string => {
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
export const dataToUsd = (data: BN, dataPerUsd: BN): BN => data.dividedBy(dataPerUsd).toNumber()

/**
 * Convert USD to DATA.
 * @param usd Number of USD to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 */
export const usdToData = (usd: BN, dataPerUsd: BN): BN => usd.multipliedBy(dataPerUsd).toNumber()

/**
 * Convert amount between fromCurrency and toCurrency.
 * @param amount Amount of units to convert.
 * @param dataPerUsd Number of DATA units per 1 USD.
 * @param fromCurrency Input currency.
 * @param toCurrency Output currency.
 */
export const convert = (amount: BN, dataPerUsd: BN, fromCurrency: Currency, toCurrency: Currency): BN => {
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
