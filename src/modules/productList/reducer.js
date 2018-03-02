// @flow

import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
} from './constants'
import type {ProductListState} from '../../flowtype/store-state'
import type {
    ProductsAction,
    ProductsErrorAction,
} from './types'

const initialState: ProductListState = {
    ids: [],
    fetching: false,
    error: null
}

const reducer: (ProductListState) => ProductListState = handleActions({
    [GET_PRODUCTS_REQUEST]: (state: ProductListState): ProductListState => ({
        ...state,
        fetching: true
    }),

    [GET_PRODUCTS_SUCCESS]: (state: ProductListState, action: ProductsAction) => ({
        ids: action.payload.products,
        fetching: false,
        error: null,
    }),

    [GET_PRODUCTS_FAILURE]: (state: ProductListState, action: ProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error
    }),

}, initialState)

export default reducer
