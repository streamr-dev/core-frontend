// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { PublishStep } from '$mp/flowtype/store-state'

export type StepAction = PayloadAction<{
    step: PublishStep,
}>
export type StepActionCreator = (PublishStep) => StepAction

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (id: ProductId) => ProductIdAction
