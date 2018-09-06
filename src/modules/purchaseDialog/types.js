// @flow

import type { ProductId } from '../../flowtype/product-types'
import type { NumberString, PayloadAction, TimeUnit } from '../../flowtype/common-types'
import type { PurchaseStep } from '../../flowtype/store-state'

export type StepAction = PayloadAction<{
    step: PurchaseStep,
    params: {},
}>
export type StepActionCreator = (step: PurchaseStep, params?: any) => StepAction

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (id: ProductId) => ProductIdAction

export type AccessPeriodAction = PayloadAction<{
    time: NumberString,
    timeUnit: TimeUnit,
}>
export type AccessPeriodActionCreator = (time: NumberString, timeUnit: TimeUnit) => AccessPeriodAction
