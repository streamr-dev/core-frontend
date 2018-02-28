// @flow
import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
} from './constants'
import type {ProductsState} from '../../flowtype/store-state'
import type {
    ProductsAction,
    ProductsErrorAction,
} from './types'

const initialState: ProductsState = {
    ids: [],
    fetching: false,
    error: null
}

const reducer: (ProductsState) => ProductsState = handleActions({
    [GET_PRODUCTS_REQUEST]: (state: ProductsState): ProductsState => ({
        ...state,
        fetching: true
    }),

    [GET_PRODUCTS_SUCCESS]: (state: ProductsState, action: ProductsAction) => ({
        ids: action.payload.products,
        fetching: false,
        error: null,
    }),

    [GET_PRODUCTS_FAILURE]: (state: ProductsState, action: ProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error
    }),

}, initialState)

export default reducer
