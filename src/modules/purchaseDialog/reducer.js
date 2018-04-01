// @flow

import { handleActions } from 'redux-actions'

import {
    INIT_PURCHASE,
    SET_ACCESS_PERIOD,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
    SET_ALLOWANCE_ERROR,
    APPROVE_PAYMENT_REQUEST,
    APPROVE_PAYMENT_SUCCESS,
    APPROVE_PAYMENT_ERROR,
    SEND_TRANSACTION_REQUEST,
    SEND_TRANSACTION_SUCCESS,
    SEND_TRANSACTION_ERROR,
} from './constants'
import { purchaseFlowSteps } from '../../utils/constants'
import type { ProductIdAction, AccessPeriodAction } from './types'
import type { PurchaseDialogState } from '../../flowtype/store-state'

const initialState: PurchaseDialogState = {
    productId: '',
    step: purchaseFlowSteps.ACCESS_PERIOD,
    waiting: false,
    data: null,
}

const reducer: (PurchaseDialogState) => PurchaseDialogState = handleActions({
    [INIT_PURCHASE]: (state: PurchaseDialogState, action: ProductIdAction) => ({
        ...state,
        productId: action.payload.id,
        data: null,
    }),

    [SET_ACCESS_PERIOD]: (state: PurchaseDialogState, action: AccessPeriodAction) => ({
        ...state,
        step: purchaseFlowSteps.ALLOWANCE,
        data: {
            time: action.payload.time,
            timeUnit: action.payload.timeUnit,
        }
    }),

    [SET_ALLOWANCE_REQUEST]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: true,
    }),

    [SET_ALLOWANCE_SUCCESS]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: false,
        step: purchaseFlowSteps.SUMMARY,
    }),

    [SET_ALLOWANCE_ERROR]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: false,
    }),

    [APPROVE_PAYMENT_REQUEST]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: true,
    }),

    [APPROVE_PAYMENT_SUCCESS]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: true,
        step: purchaseFlowSteps.COMPLETE,
    }),

    [APPROVE_PAYMENT_ERROR]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: false,
    }),

    [SEND_TRANSACTION_REQUEST]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: true,
    }),

    [SEND_TRANSACTION_SUCCESS]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: false,
    }),

    [SEND_TRANSACTION_ERROR]: (state: PurchaseDialogState) => ({
        ...state,
        waiting: false,
    }),
}, initialState)

export default reducer
