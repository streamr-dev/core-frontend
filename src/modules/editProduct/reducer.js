// @flow

import { handleActions } from 'redux-actions'

import {
    UPDATE_EDIT_PRODUCT,
    UPDATE_EDIT_PRODUCT_FIELD,
    PUT_EDIT_PRODUCT_REQUEST,
    PUT_EDIT_PRODUCT_SUCCESS,
    PUT_EDIT_PRODUCT_FAILURE,
    RESET_EDIT_PRODUCT,
} from './constants'

import type { EditProductFieldAction, EditProductAction, EditProductErrorAction } from './types'
import type { CreateProductState as EditProductState } from '../../flowtype/store-state'

const product = {
    name: '',
    description: '',
    imageUrl: '',
    category: null,
    streams: [],
    previewStream: null,
    previewConfigJson: '',
}

const initialState = {
    product,
    sending: false,
    error: null,
}

const reducer: (EditProductState) => EditProductState = handleActions({
    [UPDATE_EDIT_PRODUCT]: (state, action: EditProductAction) => ({
        ...state,
        product: {
            ...action.payload.product,
        },
    }),

    [UPDATE_EDIT_PRODUCT_FIELD]: (state, action: EditProductFieldAction) => ({
        ...state,
        product: {
            ...state.product,
            [action.payload.field]: action.payload.data,
        },
    }),

    [RESET_EDIT_PRODUCT]: () => ({
        ...initialState,
    }),

    [PUT_EDIT_PRODUCT_REQUEST]: (state: EditProductState) => ({
        ...state,
        sending: true,
    }),

    [PUT_EDIT_PRODUCT_SUCCESS]: (state: EditProductState) => ({
        ...state,
        sending: false,
    }),

    [PUT_EDIT_PRODUCT_FAILURE]: (state: EditProductState, action: EditProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
    }),
}, initialState)

export default reducer
