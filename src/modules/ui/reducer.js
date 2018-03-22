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
import type { UiState, PurchaseUiState } from '../../flowtype/store-state'

const initialState: UiState = {
    purchase: null,
}

const initialPurchaseState: PurchaseUiState = {
    product: '',
    step: purchaseFlowSteps.ACCESS_PERIOD,
    waiting: false,
    data: {}
}

const reducer: (UiState) => UiState = handleActions({
    [INIT_PURCHASE]: (state: UiState, action: ProductIdAction) => ({
        ...state,
        purchase: {
            ...initialPurchaseState,
            product: action.payload.id,
        },
    }),

    [SET_ACCESS_PERIOD]: (state: UiState, action: AccessPeriodAction) => ({
        ...state,
        purchase: {
            ...state.purchase,
            step: purchaseFlowSteps.ALLOWANCE,
        },
    }),

    [SET_ALLOWANCE_REQUEST]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: true,
        },
    }),

    [SET_ALLOWANCE_SUCCESS]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: false,
            step: purchaseFlowSteps.SUMMARY,
        },
    }),

    [SET_ALLOWANCE_ERROR]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: false,
        },
    }),

    [APPROVE_PAYMENT_REQUEST]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: true,
        },
    }),

    [APPROVE_PAYMENT_SUCCESS]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: true,
            step: purchaseFlowSteps.COMPLETE,
        },
    }),

    [APPROVE_PAYMENT_ERROR]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: false,
        },
    }),

    [SEND_TRANSACTION_REQUEST]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: true,
        },
    }),

    [SEND_TRANSACTION_SUCCESS]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: false,
        },
    }),

    [SEND_TRANSACTION_ERROR]: (state: UiState) => ({
        ...state,
        purchase: {
            ...state.purchase,
            waiting: false,
        },
    }),
}, initialState)

export default reducer
