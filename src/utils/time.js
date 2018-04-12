// @flow

import moment from 'moment'

import type { TimeUnit } from '../flowtype/common-types'

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
export const toSeconds = (quantity: number, timeUnit: TimeUnit) => {
    const format = momentFormatsByTimeUnit[timeUnit]
    if (!format) {
        throw new Error(`Invalid price unit: ${timeUnit}`)
    }
    return moment.duration(quantity, format).asSeconds()
}
