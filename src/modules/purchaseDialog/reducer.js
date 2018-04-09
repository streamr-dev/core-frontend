// @flow

import { handleActions } from 'redux-actions'

import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
} from './constants'
import { RECEIVE_SET_ALLOWANCE_HASH } from '../allowance/constants'
import { RECEIVE_PURCHASE_HASH } from '../purchase/constants'

import { purchaseFlowSteps } from '../../utils/constants'
import type { ProductIdAction, AccessPeriodAction, StepAction } from './types'
import type { PurchaseDialogState } from '../../flowtype/store-state'

const initialState: PurchaseDialogState = {
    productId: '',
    step: purchaseFlowSteps.ACCESS_PERIOD,
    data: null,
}

const reducer: (PurchaseDialogState) => PurchaseDialogState = handleActions({
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

    // Handle event from allowance here as well to set the step once the allowance transaction has started.
    [RECEIVE_SET_ALLOWANCE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: purchaseFlowSteps.SUMMARY,
    }),

    // Handle event from RECEIVE_PURCHASE_HASH to set the next step after the transaction has started.
    [RECEIVE_PURCHASE_HASH]: (state: PurchaseDialogState) => ({
        ...state,
        step: purchaseFlowSteps.COMPLETE,
    }),
}, initialState)

export default reducer
