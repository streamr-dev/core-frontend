// @flow
import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_SEARCH_TEXT,
    UPDATE_CATEGORY,
} from './constants'
import type {ProductsState} from '../../flowtype/store-state'
import type {
    ProductsAction,
    ProductsErrorAction,
    SearchTextAction,
    CategoryAction,
} from './types'

const initialState: ProductsState = {
    ids: [],
    search: '',
    category: null,
    fetching: false,
    error: null
}

const reducer: (ProductsState) => ProductsState = handleActions({
    [GET_PRODUCTS_REQUEST]: (state: ProductsState): ProductsState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [GET_PRODUCTS_SUCCESS]: (state: ProductsState, action: ProductsAction): ProductsState => ({
        ...state,
        ids: action.payload.products,
        fetching: false,
    }),

    [GET_PRODUCTS_FAILURE]: (state: ProductsState, action: ProductsErrorAction): ProductsState => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [UPDATE_SEARCH_TEXT]: (state: ProductsState, action: SearchTextAction): ProductsState => ({
        ...state,
        search: action.payload.text,
    }),

    [UPDATE_CATEGORY]: (state: ProductsState, action: CategoryAction): ProductsState => ({
        ...state,
        category: action.payload.category,
    }),

}, initialState)

export default reducer
