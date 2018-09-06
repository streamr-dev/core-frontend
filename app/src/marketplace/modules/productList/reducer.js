// @flow

import { handleActions } from 'redux-actions'

import type { ProductListState } from '../../flowtype/store-state'
import { productListPageSize } from '../../utils/constants'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
    CLEAR_PRODUCT_LIST,
} from './constants'
import type {
    ProductsAction,
    ProductsErrorAction,
    FilterAction,
} from './types'

export const initialState: ProductListState = {
    ids: [],
    filter: {
        search: '',
        categories: null,
        sortBy: null,
        maxPrice: null,
    },
    fetching: false,
    error: null,
    pageSize: productListPageSize,
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
        ids: state.ids.concat(action.payload.products),
        fetching: false,
        offset: state.offset + action.payload.products.length,
        hasMoreSearchResults: action.payload.hasMore,
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

    [CLEAR_PRODUCT_LIST]: (state: ProductListState) => ({
        ...state,
        error: null,
        ids: [],
        offset: 0,
        hasMoreSearchResults: null,
    }),

}, initialState)

export default reducer
