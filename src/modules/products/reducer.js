// @flow
import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_SEARCH_TEXT,
} from './constants'
import type {ProductsState} from '../../flowtype/store-state'
import type {
    ProductsAction,
    ProductsErrorAction,
    SearchTextAction,
} from './types'

const initialState: ProductsState = {
    ids: [],
    search: '',
    fetching: false,
    error: null
}

const reducer: (ProductsState) => ProductsState = handleActions({
    [GET_PRODUCTS_REQUEST]: (state: ProductsState): ProductsState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [GET_PRODUCTS_SUCCESS]: (state: ProductsState, action: ProductsAction) => ({
        ...state,
        ids: action.payload.products,
        fetching: false,
    }),

    [GET_PRODUCTS_FAILURE]: (state: ProductsState, action: ProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error
    }),

    [UPDATE_SEARCH_TEXT]: (state: ProductsState, action: SearchTextAction) => ({
        ...state,
        search: action.payload.text,
    })
}, initialState)

export default reducer
