// @flow

import moment from 'moment'
import BN from 'bignumber.js'

import type { TimeUnit } from '../flowtype/common-types'

import { timeUnits } from './constants'

const momentFormatsByTimeUnit = {
    second: 's',
    minute: 'm',
    hour: 'H',
    day: 'd',
    week: 'w',
    month: 'M',
}

/**
 * Convert duration to seconds.
 * @param quantity Number of units to convert.
 * @param timeUnit Unit, e.g. day, hour, minute, etc.
 */
export const toSeconds = (quantity: BN, timeUnit: TimeUnit): BN => {
    const format = momentFormatsByTimeUnit[timeUnit]
    if (!format) {
        throw new Error(`Invalid price unit: ${timeUnit}`)
    }
    return BN(moment.duration(BN(quantity).toNumber(), format).asSeconds())
}

/**
 * Returns short form for given time unit.
 * @param timeUnit Time unit to abbreviate.
 */
export const getAbbreviation = (timeUnit: TimeUnit) => {
    switch (timeUnit) {
        case timeUnits.second:
            return 's'
        case timeUnits.minute:
            return 'min'
        case timeUnits.hour:
            return 'hr'
        case timeUnits.day:
            return 'd'
        case timeUnits.week:
            return 'wk'
        case timeUnits.month:
            return 'm'
        default:
            return ''
    }
}
