// @flow

import { handleActions } from 'redux-actions'

import { publishFlowSteps } from '$mp/utils/constants'
import type { PublishDialogState } from '$mp/flowtype/store-state'

import {
    INIT_PUBLISH,
    SET_STEP,
} from './constants'
import type { ProductIdAction, StepAction } from './types'

export const initialState: PublishDialogState = {
    productId: null,
    step: publishFlowSteps.CONFIRM,
}

const reducer: (PublishDialogState) => PublishDialogState = handleActions({
    [INIT_PUBLISH]: (state: PublishDialogState, action: ProductIdAction) => ({
        ...state,
        productId: action.payload.id,
        step: publishFlowSteps.CONFIRM,
    }),

    [SET_STEP]: (state: PublishDialogState, action: StepAction) => ({
        ...state,
        step: action.payload.step,
    }),
}, initialState)

export default reducer
