// @flow

import { handleActions } from 'redux-actions'

import type { PurchaseState } from '../../flowtype/store-state'

import {
    CLEAR_PURCHASE_STATE,
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH,
    ADD_FREE_PRODUCT_REQUEST,
    ADD_FREE_PRODUCT_SUCCESS,
    ADD_FREE_PRODUCT_FAILURE,
} from './constants'
import type { PurchaseAction, HashAction, PurchaseErrorAction, ProductIdAction, ProductErrorAction } from './types'

export const initialState: PurchaseState = {
    productId: null,
    processing: false,
    error: null,
    purchaseTx: null,
}

const reducer: (PurchaseState) => PurchaseState = handleActions({
    [CLEAR_PURCHASE_STATE]: (state: PurchaseState) => ({
        ...state,
        processing: false,
        error: null,
        purchaseTx: null,
    }),

    [BUY_PRODUCT_REQUEST]: (state: PurchaseState, action: PurchaseAction) => ({
        ...state,
        productId: action.payload.productId,
        processing: true,
        error: null,
        purchaseTx: null,
    }),

    [RECEIVE_PURCHASE_HASH]: (state: PurchaseState, action: HashAction) => ({
        ...state,
        purchaseTx: action.payload.hash,
    }),

    [BUY_PRODUCT_SUCCESS]: (state: PurchaseState) => ({
        ...state,
        processing: false,
    }),

    [BUY_PRODUCT_FAILURE]: (state: PurchaseState, action: PurchaseErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
    }),

    [ADD_FREE_PRODUCT_REQUEST]: (state: PurchaseState, action: ProductIdAction) => ({
        ...state,
        productId: action.payload.id,
        processing: true,
        error: null,
    }),

    [ADD_FREE_PRODUCT_SUCCESS]: (state: PurchaseState) => ({
        ...state,
        processing: false,
    }),

    [ADD_FREE_PRODUCT_FAILURE]: (state: PurchaseState, action: ProductErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
    }),

}, initialState)

export default reducer
