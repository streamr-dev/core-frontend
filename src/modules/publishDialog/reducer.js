// @flow

import { handleActions } from 'redux-actions'

import {
    INIT_PUBLISH,
    SET_STEP,
} from './constants'

import { publishFlowSteps } from '../../utils/constants'
import type { ProductIdAction, StepAction } from './types'
import type { PublishDialogState } from '../../flowtype/store-state'

const initialState: PublishDialogState = {
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
