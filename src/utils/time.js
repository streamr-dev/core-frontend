// @flow

import moment from 'moment'

import type { PriceUnit } from '../flowtype/common-types'

const momentFormatsByPriceUnit = {
    second: 's',
    minute: 'm',
    hour: 'H',
    day: 'd',
    week: 'w',
    month: 'M',
}

export const toSeconds = (amount: number, priceUnit: PriceUnit) => {
    const format = momentFormatsByPriceUnit[priceUnit]
    if (!format) {
        throw new Error(`Invalid price unit: ${priceUnit}`)
    }
    return moment.duration(amount, format).asSeconds()
}
