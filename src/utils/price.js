// @flow

import { timeUnits } from './constants'
import { toSeconds } from './time'
import type { TimeUnit, Currency } from '../flowtype/common-types'

export const priceForTimeUnits = (pricePerSecond: number, timeAmount: number, timeUnit: TimeUnit): number => {
    const seconds = toSeconds(timeAmount, timeUnit)
    return pricePerSecond * seconds
}

export const getMostRelevantTimeUnit = (pricePerSecond: number): TimeUnit => {
    // Go from smallest time unit to the largest and see when we get a value bigger than 1.
    // This should be the most relevant unit for the user.
    const guesses = Object
        .keys(timeUnits)
        .filter((unit) => pricePerSecond * toSeconds(1, unit) >= 1)

    return guesses[0] || 'second'
}

export const formatPrice = (pricePerSecond: number, currency: Currency, digits?: number, timeUnit?: TimeUnit): string => {
    const actualTimeUnit = timeUnit || getMostRelevantTimeUnit(pricePerSecond)
    const price = priceForTimeUnits(pricePerSecond, 1, actualTimeUnit)
    const roundedPrice = digits !== undefined ? price.toFixed(digits) : price
    return `${roundedPrice} ${currency} per ${actualTimeUnit}`
}

export const dataToUsd = (data: number, dataPerUsd: number) => data / dataPerUsd

export const usdToData = (usd: number, dataPerUsd: number) => usd * dataPerUsd
