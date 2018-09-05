// @flow

import { handleActions } from 'redux-actions'

import type { ModifyContractProductState } from '../../flowtype/store-state'
import { transactionStates } from '../../utils/constants'

import {
    CREATE_CONTRACT_PRODUCT_REQUEST,
    CREATE_CONTRACT_PRODUCT_SUCCESS,
    RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
    CREATE_CONTRACT_PRODUCT_FAILURE,
} from './constants'
import type { ModifyProductAction, HashAction, ReceiptAction, ModifyProductErrorAction } from './types'

export const initialState: ModifyContractProductState = {
    hash: null,
    productId: null,
    receipt: null,
    processing: false,
    error: null,
    transactionState: null,
}

const reducer: (ModifyContractProductState) => ModifyContractProductState = handleActions({
    [CREATE_CONTRACT_PRODUCT_REQUEST]: (state: ModifyContractProductState, action: ModifyProductAction) => ({
        ...state,
        hash: null,
        productId: action.payload.productId,
        receipt: null,
        processing: true,
        error: null,
        transactionState: transactionStates.STARTED,
    }),

    [CREATE_CONTRACT_PRODUCT_SUCCESS]: (state: ModifyContractProductState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        processing: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [CREATE_CONTRACT_PRODUCT_FAILURE]: (state: ModifyContractProductState, action: ModifyProductErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
        transactionState: transactionStates.FAILED,
    }),

    [RECEIVE_CREATE_CONTRACT_PRODUCT_HASH]: (state: ModifyContractProductState, action: HashAction) => ({
        ...state,
        hash: action.payload.hash,
        transactionState: transactionStates.PENDING,
    }),
}, initialState)

export default reducer
