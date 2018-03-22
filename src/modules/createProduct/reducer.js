// @flow

import { handleActions } from 'redux-actions'

import {
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FIELD,
    RESET_PRODUCT,
    POST_PRODUCT_REQUEST,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
} from './constants'
import type {
    UpdateProductFieldAction,
    ProductAction,
    ProductErrorAction,
} from './types'
import type { CreateProductState } from '../../flowtype/store-state'

const initialState: CreateProductState = {
    product: null,
    sending: false,
    error: null,
}

const reducer: (CreateProductState) => CreateProductState = handleActions({
    [UPDATE_PRODUCT]: (state: CreateProductState, action: ProductAction) => ({
        ...state.product,
        product: {
            ...action.payload.product,
        },
    }),

    [UPDATE_PRODUCT_FIELD]: (state: CreateProductState, action: UpdateProductFieldAction) => ({
        ...state.product,
        product: {
            ...state.product,
            [action.payload.field]: action.payload.data,
        },
    }),

    [RESET_PRODUCT]: (state: CreateProductState) => ({
        ...state,
        product: null,
    }),

    [POST_PRODUCT_REQUEST]: (state: CreateProductState) => ({
        ...state,
        sending: true,
    }),

    [POST_PRODUCT_SUCCESS]: (state: CreateProductState) => ({
        ...state,
        sending: false,
    }),

    [POST_PRODUCT_FAILURE]:  (state: CreateProductState, action: ProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
    }),

}, initialState)

export default reducer
