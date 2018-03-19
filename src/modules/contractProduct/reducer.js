// @flow

import { handleActions } from 'redux-actions'
import {
    GET_CONTRACT_PRODUCT_BY_ID_REQUEST,
    GET_CONTRACT_PRODUCT_BY_ID_SUCCESS,
    GET_CONTRACT_PRODUCT_BY_ID_FAILURE,
} from './constants'
import type { ContractProductState } from '../../flowtype/store-state'
import type {
    ContractProductIdAction,
    ContractProductErrorAction,
} from './types'

const initialState: ContractProductState = {
    id: null,
    fetching: false,
    error: null,
}

const reducer: (ContractProductState) => ContractProductState = handleActions({
    [GET_CONTRACT_PRODUCT_BY_ID_REQUEST]: (state: ContractProductState, action: ContractProductIdAction) => ({
        ...state,
        id: action.payload.id,
        fetching: true,
        error: null,
    }),

    [GET_CONTRACT_PRODUCT_BY_ID_SUCCESS]: (state: ContractProductState) => ({
        ...state,
        fetching: false,
    }),

    [GET_CONTRACT_PRODUCT_BY_ID_FAILURE]: (state: ContractProductState, action: ContractProductErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),
}, initialState)

export default reducer
