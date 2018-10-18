// @flow

import { handleActions } from 'redux-actions'

import type { ModifyContractProductState } from '$mp/flowtype/store-state'
import type { ModifyProductAction, HashAction, ModifyProductErrorAction } from '$mp/modules/createContractProduct/types'

import {
    UPDATE_CONTRACT_PRODUCT_REQUEST,
    UPDATE_CONTRACT_PRODUCT_SUCCESS,
    UPDATE_CONTRACT_PRODUCT_FAILURE,
    RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
    UPDATE_CONTRACT_PRODUCT_RESET,
} from './constants'

export const initialState: ModifyContractProductState = {
    productId: null,
    processing: false,
    error: null,
    modifyTx: null,
}

const reducer: (ModifyContractProductState) => ModifyContractProductState = handleActions({
    [UPDATE_CONTRACT_PRODUCT_REQUEST]: (state: ModifyContractProductState, action: ModifyProductAction) => ({
        ...state,
        productId: action.payload.productId,
        processing: true,
        error: null,
        modifyTx: null,
    }),

    [RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH]: (state: ModifyContractProductState, action: HashAction) => ({
        ...state,
        modifyTx: action.payload.hash,
    }),

    [UPDATE_CONTRACT_PRODUCT_SUCCESS]: (state: ModifyContractProductState) => ({
        ...state,
        processing: false,
    }),

    [UPDATE_CONTRACT_PRODUCT_FAILURE]: (state: ModifyContractProductState, action: ModifyProductErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
    }),

    [UPDATE_CONTRACT_PRODUCT_RESET]: (state: ModifyContractProductState) => ({
        ...state,
        error: null,
        modifyTx: null,
        processing: false,
    }),
}, initialState)

export default reducer
