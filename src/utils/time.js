// @flow

import moment from 'moment'
import BN from 'bignumber.js'

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
export const toSeconds = (quantity: BN, timeUnit: TimeUnit): BN => {
    const format = momentFormatsByTimeUnit[timeUnit]
    if (!format) {
        throw new Error(`Invalid price unit: ${timeUnit}`)
    }
    return BN(moment.duration(quantity.toNumber(), format).asSeconds())
}
