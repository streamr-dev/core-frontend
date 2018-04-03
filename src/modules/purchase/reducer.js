// @flow

import { handleActions } from 'redux-actions'

import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH,
} from './constants'
import type { PurchaseState } from '../../flowtype/store-state'
import type { PurchaseAction, HashAction, ReceiptAction, PurchaseErrorAction } from './types'

const initialState: PurchaseState = {
    hash: null,
    productId: null,
    receipt: null,
    processing: false,
    error: null,
}

const reducer: (PurchaseState) => PurchaseState = handleActions({
    [BUY_PRODUCT_REQUEST]: (state: PurchaseState, action: PurchaseAction) => ({
        ...state,
        hash: null,
        productId: action.payload.productId,
        receipt: null,
        processing: true,
        error: null,
    }),

    [RECEIVE_PURCHASE_HASH]: (state: PurchaseState, action: HashAction) => ({
        ...state,
        hash: action.payload.hash,
    }),

    [BUY_PRODUCT_SUCCESS]: (state: PurchaseState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        processing: false,
    }),

    [BUY_PRODUCT_FAILURE]: (state: PurchaseState, action: PurchaseErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
    }),
}, initialState)

export default reducer
