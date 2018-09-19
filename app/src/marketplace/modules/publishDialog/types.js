// @flow

import type { PayloadAction } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { PublishStep } from '../../flowtype/store-state'

export type StepAction = PayloadAction<{
    step: PublishStep,
}>
export type StepActionCreator = (PublishStep) => StepAction

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (id: ProductId) => ProductIdAction
