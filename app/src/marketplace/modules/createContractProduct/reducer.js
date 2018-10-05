// @flow

import { handleActions } from 'redux-actions'

import type { ModifyContractProductState } from '$mp/flowtype/store-state'

import {
    CREATE_CONTRACT_PRODUCT_REQUEST,
    CREATE_CONTRACT_PRODUCT_SUCCESS,
    RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
    CREATE_CONTRACT_PRODUCT_FAILURE,
} from './constants'
import type { ModifyProductAction, HashAction, ModifyProductErrorAction } from './types'

export const initialState: ModifyContractProductState = {
    productId: null,
    processing: false,
    error: null,
    modifyTx: null,
}

const reducer: (ModifyContractProductState) => ModifyContractProductState = handleActions({
    [CREATE_CONTRACT_PRODUCT_REQUEST]: (state: ModifyContractProductState, action: ModifyProductAction) => ({
        ...state,
        productId: action.payload.productId,
        processing: true,
        error: null,
        modifyTx: null,
    }),

    [CREATE_CONTRACT_PRODUCT_SUCCESS]: (state: ModifyContractProductState) => ({
        ...state,
        processing: false,
    }),

    [CREATE_CONTRACT_PRODUCT_FAILURE]: (state: ModifyContractProductState, action: ModifyProductErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
    }),

    [RECEIVE_CREATE_CONTRACT_PRODUCT_HASH]: (state: ModifyContractProductState, action: HashAction) => ({
        ...state,
        modifyTx: action.payload.hash,
    }),
}, initialState)

export default reducer
