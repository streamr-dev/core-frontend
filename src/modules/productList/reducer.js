// @flow

import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_SEARCH_TEXT,
    UPDATE_CATEGORY,
    CLEAR_FILTERS,
} from './constants'
import type {ProductListState} from '../../flowtype/store-state'
import type {
    ProductsAction,
    ProductsErrorAction,
    SearchTextAction,
    CategoryAction,
} from './types'

const initialState: ProductListState = {
    ids: [],
    search: undefined,
    category: undefined,
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

    [UPDATE_SEARCH_TEXT]: (state: ProductListState, action: SearchTextAction): ProductListState => ({
        ...state,
        search: action.payload.text,
    }),

    [UPDATE_CATEGORY]: (state: ProductListState, action: CategoryAction): ProductListState => ({
        ...state,
        category: action.payload.category,
    }),

    [CLEAR_FILTERS]: (state: ProductListState) => ({
        ...state,
        search: undefined,
        category: undefined,
    }),

}, initialState)

export default reducer
