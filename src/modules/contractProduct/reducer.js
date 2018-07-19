// @flow

import { handleActions } from 'redux-actions'

import type { ContractProductState } from '../../flowtype/store-state'

import {
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    CLEAR_CONTRACT_PRODUCT,
} from './constants'
import type {
    ProductIdAction,
    ProductErrorAction,
} from './types'

export const initialState: ContractProductState = {
    id: null,
    fetchingContractProduct: false,
    contractProductError: null,
}

const reducer: (ContractProductState) => ContractProductState = handleActions({
    [GET_PRODUCT_FROM_CONTRACT_REQUEST]: (state: ContractProductState, action: ProductIdAction) => ({
        ...state,
        id: action.payload.id,
        fetchingContractProduct: true,
        contractProductError: null,
    }),

    [GET_PRODUCT_FROM_CONTRACT_SUCCESS]: (state: ContractProductState, action: ProductIdAction) => ({
        ...state,
        id: action.payload.id,
        fetchingContractProduct: false,
    }),

    [GET_PRODUCT_FROM_CONTRACT_FAILURE]: (state: ContractProductState, action: ProductErrorAction) => ({
        ...state,
        id: null,
        fetchingContractProduct: false,
        contractProductError: action.payload.error,
    }),

    [CLEAR_CONTRACT_PRODUCT]: (state: ContractProductState) => ({
        ...state,
        id: null,
        fetchingContractProduct: false,
        contractProductError: null,
    }),

}, initialState)

export default reducer
