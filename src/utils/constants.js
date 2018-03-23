// @flow

import type { Currency, PriceUnit } from '../flowtype/common-types'

// Purchase flow states
export const purchaseFlowSteps = {
    ACCESS_PERIOD: 'accessPeriod',
    ALLOWANCE: 'allowance',
    SUMMARY: 'summary',
    COMPLETE: 'complete',
}

export const currencies: Array<Currency> = [
    'DATA',
    'USD',
]

export const priceUnits: Array<PriceUnit> = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
]
