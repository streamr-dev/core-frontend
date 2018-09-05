// @flow

import { handleActions } from 'redux-actions'

import type { RelatedProductListState } from '../../flowtype/store-state'
import {
    GET_RELATED_PRODUCTS_REQUEST,
    GET_RELATED_PRODUCTS_SUCCESS,
    GET_RELATED_PRODUCTS_FAILURE,
} from './constants'
import type {
    RelatedProductsAction,
    RelatedProductsErrorAction,
} from './types'

export const initialState: RelatedProductListState = {
    ids: [],
    fetching: false,
    error: null,
}

export const reducer: (RelatedProductListState) => RelatedProductListState = handleActions({
    [GET_RELATED_PRODUCTS_REQUEST]: (state: RelatedProductListState): RelatedProductListState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [GET_RELATED_PRODUCTS_SUCCESS]: (state: RelatedProductListState, action: RelatedProductsAction) => ({
        ...state,
        ids: action.payload.products,
        fetching: false,
    }),

    [GET_RELATED_PRODUCTS_FAILURE]: (state: RelatedProductListState, action: RelatedProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

}, initialState)

export default reducer
