// @flow

import type { Currency, PriceUnit } from '../flowtype/common-types'

export const currencies: $ReadOnly<{
    [Currency]: string
}> = {
    'DATA': 'DATA',
    'USD': 'USD',
}

export const ethereumNetworks: $ReadOnly<{}> = {
    '1': 'Main',
    '3': 'Ropsten',
    '4': 'Rinkeby'
}

export const priceUnits: Array<PriceUnit> = [
    'second',
    'minute',
    'hour',
]
