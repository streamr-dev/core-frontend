// @flow

import { handleActions } from 'redux-actions'

import type { MyProductListState } from '../../flowtype/store-state'
import {
    GET_MY_PRODUCTS_REQUEST,
    GET_MY_PRODUCTS_SUCCESS,
    GET_MY_PRODUCTS_FAILURE,
    UPDATE_FILTER,
} from './constants'
import type {
    MyProductsAction,
    MyProductsErrorAction,
    MyProductsFilterAction,
} from './types'

export const initialState: MyProductListState = {
    ids: [],
    fetching: false,
    error: null,
    filter: null,
}

const reducer: (MyProductListState) => MyProductListState = handleActions({
    [GET_MY_PRODUCTS_REQUEST]: (state: MyProductListState): MyProductListState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [GET_MY_PRODUCTS_SUCCESS]: (state: MyProductListState, action: MyProductsAction) => ({
        ...state,
        ids: action.payload.products,
        fetching: false,
    }),

    [GET_MY_PRODUCTS_FAILURE]: (state: MyProductListState, action: MyProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [UPDATE_FILTER]: (state: MyProductListState, action: MyProductsFilterAction) => ({
        ...state,
        filter: action.payload.filter,
    }),

}, initialState)

export default reducer
