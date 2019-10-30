// @flow

import { handleActions } from 'redux-actions'

import { RECEIVE_SET_ALLOWANCE_HASH, RECEIVE_RESET_ALLOWANCE_HASH } from '$mp/modules/allowance/constants'
import { RECEIVE_PURCHASE_HASH } from '$mp/modules/purchase/constants'
import { purchaseFlowSteps } from '$mp/utils/constants'
import type { PurchaseDialogState } from '$mp/flowtype/store-state'

import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
} from './constants'
import type { ProductIdAction, AccessPeriodAction, StepAction } from './types'

export const initialState: PurchaseDialogState = {
    productId: null,
    step: purchaseFlowSteps.ACCESS_PERIOD,
    stepParams: null,
    data: null,
}

export const reducer: (PurchaseDialogState) => PurchaseDialogState = handleActions({
    [INIT_PURCHASE]: (state: PurchaseDialogState, action: ProductIdAction) => ({
        ...state,
        productId: action.payload.id,
        data: null,
        step: purchaseFlowSteps.ACCESS_PERIOD,
        stepParams: null,
    }),

    [SET_STEP]: (state: PurchaseDialogState, action: StepAction) => ({
        ...state,
        step: action.payload.step,
        stepParams: action.payload.params,
    }),

    [SET_ACCESS_PERIOD]: (state: PurchaseDialogState, action: AccessPeriodAction) => ({
        ...state,
        data: {
            time: action.payload.time,
            timeUnit: action.payload.timeUnit,
        },
    }),

    // Handle event from allowance here as well to set the step once the allowance transaction has started.
    [RECEIVE_SET_ALLOWANCE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: purchaseFlowSteps.SUMMARY,
    }),

    [RECEIVE_RESET_ALLOWANCE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: purchaseFlowSteps.ALLOWANCE,
    }),

    // Handle event from RECEIVE_PURCHASE_HASH to set the next step after the transaction has started.
    [RECEIVE_PURCHASE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: purchaseFlowSteps.COMPLETE,
    }),
}, initialState)

export default reducer
