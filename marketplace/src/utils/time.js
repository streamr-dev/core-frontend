// @flow

import moment, { type Moment } from 'moment'
import BN from 'bignumber.js'

import type { NumberString, TimeUnit } from '../flowtype/common-types'

import { timeUnits } from './constants'

const momentDurationFormatsByTimeUnit = {
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
export const toSeconds = (quantity: NumberString | BN, timeUnit: TimeUnit): BN => {
    const format = momentDurationFormatsByTimeUnit[timeUnit]
    if (!format) {
        throw new Error(`Invalid price unit: ${timeUnit}`)
    }
    return BN(moment.duration(BN(quantity).toNumber(), format).asSeconds())
}

export const formatDateTime = (timestamp: ?number, timezone: ?string) => timestamp && moment.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')

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

/**
 * Returns true if the given time is in the future.
 * @param time Time to check
 */
export const isActive = (time: string | number | Date | Moment): boolean => moment().isBefore(time)
