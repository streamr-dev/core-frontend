// @flow

import BN from 'bignumber.js'

import type { TimeUnit, PaymentCurrency, ContractCurrency, NumberString } from '$shared/flowtype/common-types'
import { timeUnits, contractCurrencies, paymentCurrencies } from '$shared/utils/constants'
import { toSeconds, getAbbreviation } from './time'

/**
 * Validates if given string can be used as price
 * @param value string Number as string
 * @return boolean
 */
export const isPriceValid = (value: string) => {
    const bn = BN(value)
    return !bn.isNaN() && bn.isGreaterThan(0)
}

export const priceForTimeUnits = (pricePerSecond: NumberString | BN, timeAmount: number | NumberString | BN, timeUnit: TimeUnit): BN => {
    const seconds = toSeconds(timeAmount, timeUnit)
    return BN(pricePerSecond).multipliedBy(seconds)
}

export const pricePerSecondFromTimeUnit = (pricePerTimeUnit: BN, timeUnit: TimeUnit): BN => (
    BN(pricePerTimeUnit)
        .dividedBy(toSeconds(1, timeUnit))
)

/**
 * Make sure the amount is a non-negative number.
 * @param amount Number to sanitize.
 */
export const sanitize = (amount: BN): BN => (BN(amount).isNaN() ? BN(0) : BN.max(BN(0), amount))

/**
 * Limit the number of fraction digits.
 * @param value Amount to limit.
 * @param maxDigits Max. number of fraction digits.
 */
export const formatAmount = (value: BN, maxDigits: ?number): BN => {
    if (typeof maxDigits === 'number' && maxDigits >= 0) {
        return BN(sanitize(value).decimalPlaces(maxDigits))
    }
    return value
}

/**
 * "Intelligently" reduce and display decimals in relation to number size and currency.
 * Human currencies: always 2 decimals for 0-99, always 1 decimal 100-999. 1000+ no decimals
 * DATA currency: Hide decimals for round numbers. 1000+ no decimals.
 * @param value
 * @param currency
 * @returns {*}
 */
export const formatDecimals = (value: number | BN, currency: ContractCurrency | PaymentCurrency): string => {
    let result

    if (currency === paymentCurrencies.ETH) {
        return BN(value).toFixed(4)
    }

    if (currency === paymentCurrencies.DAI) {
        return BN(value).toFixed(2)
    }

    if (Math.abs(value) < 10) {
        result = (currency === contractCurrencies.DATA) ? BN(value).decimalPlaces(3) : BN(value).toFixed(2)
    } else if (Math.abs(value) < 100) {
        result = (currency === contractCurrencies.DATA) ? BN(value).decimalPlaces(2) : BN(value).toFixed(2)
    } else if (Math.abs(value) < 1000) {
        result = (currency === contractCurrencies.DATA) ? BN(value).decimalPlaces(1) : BN(value).toFixed(1)
    } else {
        result = BN(value).decimalPlaces(0)
    }
    return result.toString()
}

export const arePricesEqual = (first: NumberString, second: NumberString) => BN(first).isEqualTo(second)

/**
 * Gets most relevant time unit for given price per second.
 * @param pricePerSecond Price per second.
 */
export const getMostRelevantTimeUnit = (pricePerSecond: BN): TimeUnit => {
    // Go from smallest time unit to the largest and see when we get a value bigger than 1.
    // This should be the most relevant unit for the user.
    const guesses = Object
        .keys(timeUnits)
        .filter((unit) => toSeconds(1, unit).multipliedBy(pricePerSecond).isGreaterThanOrEqualTo(1))

    return guesses[0] || timeUnits.second
}

/**
 * Formats given price to a human readable string
 * @param pricePerSecond Price per second.
 * @param currency Currency.
 * @param timeUnit TimeUnit to use. If omitted, the most relevant time unit is calculated.
 */
export const formatPrice = (pricePerSecond: BN, currency: PaymentCurrency | ContractCurrency, timeUnit?: TimeUnit): string => {
    const actualTimeUnit = timeUnit || getMostRelevantTimeUnit(pricePerSecond)
    const price = priceForTimeUnits(pricePerSecond, 1, actualTimeUnit)
    const timeUnitAbbreviation = getAbbreviation(actualTimeUnit)
    const roundedPrice = formatDecimals(price, currency)
    return `${roundedPrice} ${currency} / ${timeUnitAbbreviation}`
}
