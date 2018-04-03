// @flow

import { priceUnits } from './constants'
import type { PriceUnit } from '../flowtype/common-types'

export const toSeconds = (time: number, timeUnit: PriceUnit): number => (
    time * (60 ** priceUnits.indexOf(timeUnit))
)
