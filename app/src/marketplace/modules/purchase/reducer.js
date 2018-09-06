// @flow

import { handleActions } from 'redux-actions'

import type { PurchaseState } from '../../flowtype/store-state'
import { transactionStates } from '../../utils/constants'

import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH,
    ADD_FREE_PRODUCT_REQUEST,
    ADD_FREE_PRODUCT_SUCCESS,
    ADD_FREE_PRODUCT_FAILURE,
} from './constants'
import type { PurchaseAction, HashAction, ReceiptAction, PurchaseErrorAction, ProductIdActionCreator, ProductErrorActionCreator } from './types'

export const initialState: PurchaseState = {
    hash: null,
    productId: null,
    receipt: null,
    processing: false,
    error: null,
    transactionState: null,
}

const reducer: (PurchaseState) => PurchaseState = handleActions({
    [BUY_PRODUCT_REQUEST]: (state: PurchaseState, action: PurchaseAction) => ({
        ...state,
        hash: null,
        productId: action.payload.productId,
        receipt: null,
        processing: true,
        error: null,
        transactionState: transactionStates.STARTED,
    }),

    [RECEIVE_PURCHASE_HASH]: (state: PurchaseState, action: HashAction) => ({
        ...state,
        hash: action.payload.hash,
        transactionState: transactionStates.PENDING,
    }),

    [BUY_PRODUCT_SUCCESS]: (state: PurchaseState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        processing: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [BUY_PRODUCT_FAILURE]: (state: PurchaseState, action: PurchaseErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
        transactionState: transactionStates.FAILED,
    }),

    [ADD_FREE_PRODUCT_REQUEST]: (state: PurchaseState, action: ProductIdActionCreator) => ({
        ...state,
        productId: action.payload.id,
        receipt: null,
        processing: true,
        error: null,
        hash: null,
        transactionState: transactionStates.STARTED,
    }),

    [ADD_FREE_PRODUCT_SUCCESS]: (state: PurchaseState) => ({
        ...state,
        transactionState: transactionStates.CONFIRMED,
        processing: false,
    }),

    [ADD_FREE_PRODUCT_FAILURE]: (state: PurchaseState, action: ProductErrorActionCreator) => ({
        ...state,
        error: action.payload.error,
        processing: false,
        transactionState: transactionStates.FAILED,
    }),

}, initialState)

export default reducer
