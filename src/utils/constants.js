// @flow

import type { Currency, PriceUnit } from '../flowtype/common-types'

export const currencies: $ReadOnly<{
    [Currency]: string
}> = {
    'DATA': 'DATA',
    'USD': 'USD',
}

export const priceUnits: Array<PriceUnit> = [
    'second',
    'minute',
    'hour',
]
