// @flow

import type { ProductId } from '../../flowtype/product-types'
import type { PayloadAction, TimeUnit } from '../../flowtype/common-types'

export type StepAction = PayloadAction<{
    step: string,
}>
export type StepActionCreator = (string) => StepAction

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (id: ProductId) => ProductIdAction

export type AccessPeriodAction = PayloadAction<{
    time: number,
    timeUnit: TimeUnit,
}>
export type AccessPeriodActionCreator = (time: number, timeUnit: TimeUnit) => AccessPeriodAction
