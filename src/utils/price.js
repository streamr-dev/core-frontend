// @flow

import { toSeconds } from './time'
import { type PriceUnit } from '../flowtype/common-types'

export const priceForPriceUnits = (pricePerSecond: number, timeAmount: number, priceUnit: PriceUnit, digits?: number) => {
    const seconds = toSeconds(timeAmount, priceUnit)
    const price = pricePerSecond * seconds
    return digits ? price.toFixed(digits) : price
}

export const dataToUsd = (data: number, dataPerUsd: number) => data / dataPerUsd

export const usdToData = (usd: number, dataPerUsd: number) => usd * dataPerUsd
