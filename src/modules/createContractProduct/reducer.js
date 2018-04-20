// @flow

import { handleActions } from 'redux-actions'

import type { CreateContractProductState } from '../../flowtype/store-state'
import { transactionStates } from '../../utils/constants'

import {
    CREATE_CONTRACT_PRODUCT_REQUEST,
    CREATE_CONTRACT_PRODUCT_SUCCESS,
    RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
    CREATE_CONTRACT_PRODUCT_FAILURE,
} from './constants'
import type { CreateProductAction, HashAction, ReceiptAction, CreateProductErrorAction } from './types'

const initialState: CreateContractProductState = {
    hash: null,
    productId: null,
    receipt: null,
    processing: false,
    error: null,
    transactionState: null,
}

const reducer: (CreateContractProductState) => CreateContractProductState = handleActions({
    [CREATE_CONTRACT_PRODUCT_REQUEST]: (state: CreateContractProductState, action: CreateProductAction) => ({
        ...state,
        hash: null,
        productId: action.payload.productId,
        receipt: null,
        processing: true,
        error: null,
        transactionState: transactionStates.STARTED,
    }),

    [RECEIVE_CREATE_CONTRACT_PRODUCT_HASH]: (state: CreateContractProductState, action: HashAction) => ({
        ...state,
        hash: action.payload.hash,
        transactionState: transactionStates.PENDING,
    }),

    [CREATE_CONTRACT_PRODUCT_SUCCESS]: (state: CreateContractProductState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        processing: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [CREATE_CONTRACT_PRODUCT_FAILURE]: (state: CreateContractProductState, action: CreateProductErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
        transactionState: transactionStates.FAILED,
    }),
}, initialState)

export default reducer
