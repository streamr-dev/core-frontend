// @flow

import type { PayloadAction } from '$mp/flowtype/common-types'
import type { PurchaseStep } from '$mp/flowtype/store-state'

export type StepAction = PayloadAction<{
    step: PurchaseStep,
    params: {},
}>
export type StepActionCreator = (step: PurchaseStep, params?: any) => StepAction
