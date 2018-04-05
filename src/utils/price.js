// @flow

import { toSeconds } from './time'
import type { TimeUnit, Currency } from '../flowtype/common-types'

export const priceForTimeUnits = (pricePerSecond: number, timeAmount: number, timeUnit: TimeUnit): number => {
    const seconds = toSeconds(timeAmount, timeUnit)
    return pricePerSecond * seconds
}

export const formatPrice = (pricePerSecond: number, timeUnit: TimeUnit, currency: Currency, digits?: number): string => {
    const price = priceForTimeUnits(pricePerSecond, 1, timeUnit)
    const roundedPrice = digits !== undefined ? price.toFixed(digits) : price
    return `${roundedPrice} ${currency} per ${timeUnit}`
}

export const dataToUsd = (data: number, dataPerUsd: number) => data / dataPerUsd

export const usdToData = (usd: number, dataPerUsd: number) => usd * dataPerUsd
