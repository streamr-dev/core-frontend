// @flow

import { handleActions } from 'redux-actions'

import {
    SHOW_MODAL,
    HIDE_MODAL,
    INIT_PURCHASE,
    SET_ACCESS_PERIOD,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
} from './constants'
import { purchaseFlowSteps } from '../../utils/constants'
import type { ModalAction, ProductIdAction, AccessPeriodAction } from './types'
import type { UiState, PurchaseUiState } from '../../flowtype/store-state'

const initialState: UiState = {
    modal: null,
    purchase: null,
}

const initialPurchaseState: PurchaseUiState = {
    product: '',
    step: purchaseFlowSteps.ACCESS_PERIOD,
    waiting: false,
    data: {}
}

const reducer: (UiState) => UiState = handleActions({
    [SHOW_MODAL]: (state: UiState, action: ModalAction): UiState => ({
        ...state,
        modal: {
            id: action.payload.id,
        },
    }),

    [HIDE_MODAL]: (state: UiState) => ({
        ...state,
        modal: null,
    }),

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

}, initialState)

export default reducer
