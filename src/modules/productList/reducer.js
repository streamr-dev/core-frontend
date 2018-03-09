// @flow

import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
} from './constants'
import type {ProductListState} from '../../flowtype/store-state'
import type {
    ProductsAction,
    ProductsErrorAction,
    FilterAction,
} from './types'

const initialState: ProductListState = {
    ids: [],
    filter: {
        search: undefined,
        category: undefined,
    },
    fetching: false,
    error: null
}

const reducer: (ProductListState) => ProductListState = handleActions({
    [GET_PRODUCTS_REQUEST]: (state: ProductListState): ProductListState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [GET_PRODUCTS_SUCCESS]: (state: ProductListState, action: ProductsAction) => ({
        ...state,
        ids: action.payload.products,
        fetching: false,
    }),

    [GET_PRODUCTS_FAILURE]: (state: ProductListState, action: ProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [UPDATE_FILTER]: (state: ProductListState, action: FilterAction): ProductListState => ({
        ...state,
        filter: action.payload.filter,
    }),

    [CLEAR_FILTERS]: (state: ProductListState) => ({
        ...state,
        filter: {
            search: undefined,
            category: undefined,
        }
    }),

}, initialState)

export default reducer
