// @flow

import { handleActions } from 'redux-actions'

import {
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE
} from './constants'
import type {ProductState} from '../../flowtype/store-state'
import type {
    ProductIdAction,
    ProductErrorAction,
} from './types'

const initialState: ProductState = {
    id: null,
    fetching: false,
    error: null
}

const reducer: (ProductState) => ProductState = handleActions({
    [GET_PRODUCT_BY_ID_REQUEST]: (state: ProductState, action: ProductIdAction) => ({
        id: action.payload.id,
        fetching: true,
        error: null,
    }),

    [GET_PRODUCT_BY_ID_SUCCESS]: (state: ProductState) => ({
        ...state,
        fetching: false,
    }),

    [GET_PRODUCT_BY_ID_FAILURE]: (state: ProductState, action: ProductErrorAction) => ({
        ...state,
        error: action.payload.error,
        fetching: false,
    }),

}, initialState)

export default reducer
