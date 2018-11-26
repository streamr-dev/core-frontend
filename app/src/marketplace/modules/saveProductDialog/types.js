// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'
import type { PurchaseStep } from '$mp/flowtype/store-state'

export type StepAction = PayloadAction<{
    step: PurchaseStep,
}>
export type StepActionCreator = (step: PurchaseStep) => StepAction
