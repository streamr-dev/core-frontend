import BN from 'bignumber.js'
import {
    PaymentCurrency,
    ContractCurrency,
    NumberString,
} from '~/shared/types/common-types'
import { contractCurrencies, paymentCurrencies } from '~/shared/utils/constants'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'
import { toSeconds, getAbbreviation } from './time'
import { fromDecimals, toDecimals } from './math'

/**
 * Validates if given string can be used as price
 * @param value string Number as string
 * @return boolean
 */
export const isPriceValid = (value: string | BN): boolean => {
    const bn = new BN(value)
    return !bn.isNaN() && bn.isGreaterThan(0)
}
export const priceForTimeUnits = (
    pricePerSecond: NumberString | BN,
    timeAmount: number | NumberString | BN,
    timeUnit: TimeUnit,
): BN => {
    const seconds = toSeconds(timeAmount as string | BN, timeUnit)
    return new BN(pricePerSecond).multipliedBy(seconds)
}
export const pricePerSecondFromTimeUnit = (
    pricePerTimeUnit: BN,
    timeUnit: TimeUnit,
    decimals: BN,
): string => {
    const pptInTokens = toDecimals(pricePerTimeUnit, decimals)
    return new BN(pptInTokens).dividedBy(toSeconds('1', timeUnit)).toFixed(0)
}

/**
 * Make sure the amount is a non-negative number.
 * @param amount Number to sanitize.
 */
export const sanitize = (amount: BN): BN =>
    new BN(amount).isNaN() ? new BN(0) : BN.max(new BN(0), amount)

/**
 * Limit the number of fraction digits.
 * @param value Amount to limit.
 * @param maxDigits Max. number of fraction digits.
 */
export const formatAmount = (value: BN, maxDigits: number | null | undefined): BN => {
    if (typeof maxDigits === 'number' && maxDigits >= 0) {
        return new BN(sanitize(value).decimalPlaces(maxDigits))
    }

    return value
}

/**
 * "Intelligently" reduce and display decimals in relation to number size and currency.
 * Human currencies: always 2 decimals for 0-99, always 1 decimal 100-999. 1000+ no decimals
 * DATA currency: Hide decimals for round numbers. 1000+ no decimals.
 * @param value
 * @param currency
 * @param decimals PricingToken decimal count
 * @returns {*}
 */
export const formatDecimals = (
    value: number | BN,
    currency: ContractCurrency | PaymentCurrency,
    decimals?: BN,
): string => {
    let result

    if (currency === paymentCurrencies.ETH) {
        return new BN(value).toFixed(4)
    }

    if (currency === paymentCurrencies.DAI) {
        return new BN(value).toFixed(2)
    }

    if (currency === paymentCurrencies.PRODUCT_DEFINED) {
        return fromDecimals(value as string | BN, decimals).toFixed(2)
    }

    if (Math.abs(value as number) < 10) {
        result =
            currency === contractCurrencies.DATA
                ? new BN(value).decimalPlaces(3)
                : new BN(value).toFixed(2)
    } else if (Math.abs(value as number) < 100) {
        result =
            currency === contractCurrencies.DATA
                ? new BN(value).decimalPlaces(2)
                : new BN(value).toFixed(2)
    } else if (Math.abs(value as number) < 1000) {
        result =
            currency === contractCurrencies.DATA
                ? new BN(value).decimalPlaces(1)
                : new BN(value).toFixed(1)
    } else {
        result = new BN(value).decimalPlaces(0)
    }

    return result.toString()
}
export const arePricesEqual = (first: NumberString, second: NumberString): boolean =>
    new BN(first).isEqualTo(new BN(second))

/**
 * Gets most relevant time unit for given price per second.
 * @param pricePerSecond Price per second.
 */
export const getMostRelevantTimeUnit = (pricePerSecond: BN): TimeUnit => {
    // Go from smallest time unit to the largest and see when we get a value bigger than 1.
    // This should be the most relevant unit for the user.
    const guesses = Object.keys(timeUnits).filter((unit) =>
        toSeconds('1', unit).multipliedBy(pricePerSecond).isGreaterThanOrEqualTo(1),
    )
    return guesses[0] || timeUnits.second
}

/**
 * Formats given price to a human readable string
 * @param pricePerSecond Price per second.
 * @param currency Currency.
 * @param decimals Decimals.
 * @param timeUnit TimeUnit to use. If omitted, the most relevant time unit is calculated.
 * @param symbol Symbol to use if currency === PRODUCT_DEFINED.
 */
export const formatPrice = (
    pricePerSecond: BN,
    currency: PaymentCurrency | ContractCurrency,
    decimals: BN,
    timeUnit?: TimeUnit,
    symbol?: string,
): string => {
    const actualTimeUnit = timeUnit || getMostRelevantTimeUnit(pricePerSecond)
    const price = priceForTimeUnits(pricePerSecond, 1, actualTimeUnit)
    const timeUnitAbbreviation = getAbbreviation(actualTimeUnit)
    const roundedPrice = formatDecimals(price, currency, decimals)
    let actualSymbol = currency

    if (currency === contractCurrencies.PRODUCT_DEFINED && symbol != null) {
        actualSymbol = symbol
    }

    return `${roundedPrice} ${actualSymbol} / ${timeUnitAbbreviation}`
}
