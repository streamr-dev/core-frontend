import { ContractCurrency, PaymentCurrency } from '~/shared/types/common-types'
import { contractCurrencies, paymentCurrencies } from '~/shared/utils/constants'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'
import { BNish, toBN, toFloat } from '~/utils/bn'
import { convertPrice } from '~/utils/price'
import { getAbbreviation } from './time'

/**
 * Validates if given string can be used as price
 * @param value string Number as string
 * @return boolean
 */
export function isPriceValid(value: BNish): boolean {
    try {
        return toBN(value).gt(0)
    } catch (e) {
        return false
    }
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
export function formatDecimals(
    value: bigint,
    currency: ContractCurrency | PaymentCurrency,
    decimals: bigint,
): string {
    const bn = toFloat(value, decimals)

    if (currency === paymentCurrencies.ETH) {
        return bn.toFixed(4)
    }

    if (currency === paymentCurrencies.DAI) {
        return bn.toFixed(2)
    }

    if (currency === paymentCurrencies.PRODUCT_DEFINED) {
        if (!decimals) {
            throw new Error('Decimals are required')
        }

        return toFloat(value, decimals).toFixed(2)
    }

    if (bn.abs().lt(10)) {
        return currency === contractCurrencies.DATA
            ? bn.decimalPlaces(3).toString()
            : bn.toFixed(2)
    }

    if (bn.abs().lt(100)) {
        return currency === contractCurrencies.DATA
            ? bn.decimalPlaces(2).toString()
            : bn.toFixed(2)
    }

    if (bn.abs().lt(1000)) {
        return currency === contractCurrencies.DATA
            ? bn.decimalPlaces(1).toString()
            : bn.toFixed(1)
    }

    return bn.decimalPlaces(0).toString()
}

/**
 * Gets most relevant time unit for given price per second.
 * @param pricePerSecond Price per second.
 */
export function getMostRelevantTimeUnit(
    pricePerSecond: bigint,
    decimals: bigint,
): TimeUnit {
    /**
     * Go from smallest time unit to the largest and see when we get a value
     * bigger than 1. This should be the most relevant unit for the user.
     */
    const guess = Object.keys(timeUnits).find((unit) =>
        toFloat(convertPrice(pricePerSecond, [1, unit as TimeUnit]), decimals).gte(1),
    ) as TimeUnit | undefined

    return guess || timeUnits.second
}

/**
 * Formats given price to a human readable string
 * @param pricePerSecond Price per second in wei.
 * @param currency Currency.
 * @param decimals Decimals.
 * @param timeUnit TimeUnit to use. If omitted, the most relevant time unit is calculated.
 * @param symbol Symbol to use if currency === PRODUCT_DEFINED.
 */
export function formatPrice(
    pricePerSecond: bigint,
    currency: PaymentCurrency | ContractCurrency,
    decimals: bigint,
    timeUnit?: TimeUnit,
    symbol?: string,
): string {
    const actualTimeUnit = timeUnit || getMostRelevantTimeUnit(pricePerSecond, decimals)

    const price = convertPrice(pricePerSecond, actualTimeUnit)

    const timeUnitAbbreviation = getAbbreviation(actualTimeUnit)

    const roundedPrice = formatDecimals(price, currency, decimals)

    let actualSymbol = currency

    if (currency === contractCurrencies.PRODUCT_DEFINED && symbol != null) {
        actualSymbol = symbol
    }

    return `${roundedPrice} ${actualSymbol} / ${timeUnitAbbreviation}`
}
