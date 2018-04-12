// @flow

import type { ProductId } from '../../flowtype/product-types'
import type { PayloadAction, TimeUnit } from '../../flowtype/common-types'
import type { PurchaseStep } from '../../flowtype/store-state'

export type StepAction = PayloadAction<{
    step: PurchaseStep,
}>
export type StepActionCreator = (PurchaseStep) => StepAction

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (id: ProductId) => ProductIdAction

export type AccessPeriodAction = PayloadAction<{
    time: number,
    timeUnit: TimeUnit,
}>
export type AccessPeriodActionCreator = (time: number, timeUnit: TimeUnit) => AccessPeriodAction
