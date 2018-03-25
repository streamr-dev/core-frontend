// @flow

import indexOf from 'lodash/indexOf'

import { priceUnits } from './constants'
import type { PriceUnit } from '../flowtype/common-types'

export const toSeconds = (time: number, timeUnit: PriceUnit): number => {
    return time * Math.pow(60, indexOf(priceUnits, timeUnit))
}
