// @flow

import { handleActions } from 'redux-actions'

import type { ProductListState } from '../../flowtype/store-state'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
    LOAD_MORE_PRODUCTS_REQUEST,
    LOAD_MORE_PRODUCTS_SUCCESS,
    LOAD_MORE_PRODUCTS_FAILURE,
    CLEAR_SEARCH_RESULTS,
} from './constants'
import type {
    ProductsAction,
    ProductsErrorAction,
    FilterAction,
} from './types'

const initialState: ProductListState = {
    ids: [],
    filter: {
        search: '',
        categories: null,
        sortBy: null,
        maxPrice: null,
    },
    fetching: false,
    error: null,
    pageSize: 8,
    offset: 0,
    hasMoreSearchResults: null,
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
        filter: initialState.filter,
    }),

    [LOAD_MORE_PRODUCTS_REQUEST]: (state: ProductListState): ProductListState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [LOAD_MORE_PRODUCTS_SUCCESS]: (state: ProductListState, action: ProductsAction) => ({
        ...state,
        ids: state.ids.concat(action.payload.products),
        fetching: false,
        offset: state.offset + action.payload.products.length,
        hasMoreSearchResults: action.payload.products.length === state.pageSize,
    }),

    [LOAD_MORE_PRODUCTS_FAILURE]: (state: ProductListState, action: ProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [CLEAR_SEARCH_RESULTS]: (state: ProductListState) => ({
        ...state,
        error: null,
        ids: [],
        offset: 0,
        hasMoreSearchResults: null,
    }),

}, initialState)

export default reducer
