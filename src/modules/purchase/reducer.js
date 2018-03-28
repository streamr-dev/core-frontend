// @flow

import { handleActions } from 'redux-actions'

import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH_SUCCESS,
    RECEIVE_PURCHASE_HASH_FAILURE,
} from './constants'
import type { PurchaseState } from '../../flowtype/store-state'
import type { PurchaseAction, HashAction, ReceiptAction, PurchaseErrorAction } from './types'

const initialState: PurchaseState = {
    id: null,
    productId: null,
    receipt: null,
    waiting: false,
    processing: false,
    error: null,
}

const reducer: (ProductListState) => PurchaseState = handleActions({
    [BUY_PRODUCT_REQUEST]: (state: PurchaseState, action: PurchaseAction) => ({
        ...state,
        id: null,
        productId: action.payload.productId,
        receipt: null,
        waiting: true,
        processing: false,
        error: null,
    }),

    [RECEIVE_PURCHASE_HASH_SUCCESS]: (state: PurchaseState, action: HashAction) => ({
        ...state,
        id: action.payload.id,
        waiting: false,
        processing: true,
    }),

    [RECEIVE_PURCHASE_HASH_FAILURE]: (state: PurchaseState, action: HashErrorAction) => ({
        ...state,
        error: action.payload.error,
        waiting: false,
    }),

    [BUY_PRODUCT_SUCCESS]: (state: PurchaseState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        processing: false,
    }),

    [BUY_PRODUCT_FAILURE]: (state: PurchaseState, action: PurchaseErrorAction) => ({
        ...state,
        receipt: action.payload.receipt,
        error: action.payload.error,
        processing: false,
    }),
}, initialState)

export default reducer
