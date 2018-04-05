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

export const toSeconds = (quantity: number, timeUnit: TimeUnit) => {
    const format = momentFormatsByTimeUnit[timeUnit]
    if (!format) {
        throw new Error(`Invalid price unit: ${timeUnit}`)
    }
    return moment.duration(quantity, format).asSeconds()
}
