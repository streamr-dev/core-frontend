// @flow

import { toSeconds } from './time'
import type { PriceUnit, Currency } from '../flowtype/common-types'

export const priceForPriceUnits = (pricePerSecond: number, timeAmount: number, priceUnit: PriceUnit): number => {
    const seconds = toSeconds(timeAmount, priceUnit)
    return pricePerSecond * seconds
}

export const formatPrice = (pricePerSecond: number, priceUnit: PriceUnit, currency: Currency, digits?: number): string => {
    const price = priceForPriceUnits(pricePerSecond, 1, priceUnit)
    const roundedPrice = digits !== undefined ? price.toFixed(digits) : price
    return `${roundedPrice} ${currency} per ${priceUnit}`
}

export const dataToUsd = (data: number, dataPerUsd: number) => data / dataPerUsd

export const usdToData = (usd: number, dataPerUsd: number) => usd * dataPerUsd
