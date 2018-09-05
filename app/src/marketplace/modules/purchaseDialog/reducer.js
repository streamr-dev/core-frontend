// @flow

import { handleActions } from 'redux-actions'

import { RECEIVE_SET_ALLOWANCE_HASH } from '../allowance/constants'
import { RECEIVE_PURCHASE_HASH } from '../purchase/constants'
import { purchaseFlowSteps } from '../../utils/constants'
import type { PurchaseDialogState } from '../../flowtype/store-state'
import type { AllowanceAction } from '../allowance/types'

import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
    REPLACE_ALLOWANCE,
    RESET_REPLACED_ALLOWANCE,
} from './constants'
import type { ProductIdAction, AccessPeriodAction, StepAction } from './types'

export const initialState: PurchaseDialogState = {
    productId: null,
    step: purchaseFlowSteps.ACCESS_PERIOD,
    data: null,
    replacedAllowance: null,
}

export const reducer: (PurchaseDialogState) => PurchaseDialogState = handleActions({
    [INIT_PURCHASE]: (state: PurchaseDialogState, action: ProductIdAction) => ({
        ...state,
        productId: action.payload.id,
        data: null,
        step: purchaseFlowSteps.ACCESS_PERIOD,
    }),

    [SET_STEP]: (state: PurchaseDialogState, action: StepAction) => ({
        ...state,
        step: action.payload.step,
    }),

    [SET_ACCESS_PERIOD]: (state: PurchaseDialogState, action: AccessPeriodAction) => ({
        ...state,
        data: {
            time: action.payload.time,
            timeUnit: action.payload.timeUnit,
        },
    }),

    [REPLACE_ALLOWANCE]: (state: PurchaseDialogState, action: AllowanceAction) => ({
        ...state,
        replacedAllowance: action.payload.allowance,
    }),

    [RESET_REPLACED_ALLOWANCE]: (state: PurchaseDialogState) => ({
        ...state,
        replacedAllowance: null,
    }),

    // Handle event from allowance here as well to set the step once the allowance transaction has started.
    [RECEIVE_SET_ALLOWANCE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: state.replacedAllowance !== null ? purchaseFlowSteps.ALLOWANCE : purchaseFlowSteps.SUMMARY,
    }),

    // Handle event from RECEIVE_PURCHASE_HASH to set the next step after the transaction has started.
    [RECEIVE_PURCHASE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: purchaseFlowSteps.COMPLETE,
    }),
}, initialState)

export default reducer
