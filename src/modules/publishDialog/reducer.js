// @flow

import { handleActions } from 'redux-actions'

import {
    INIT_PUBLISH,
    SET_STEP,
} from './constants'
import { POST_DEPLOY_FREE_PRODUCT_SUCCESS } from '../product/constants'

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

    // Handle event from allowance here as well to set the step once the allowance transaction has started.
    [POST_DEPLOY_FREE_PRODUCT_SUCCESS]: (state: PublishDialogState) => ({
        ...state,
        step: publishFlowSteps.COMPLETE,
    }),

}, initialState)

export default reducer
