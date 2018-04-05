// @flow

import { handleActions } from 'redux-actions'

import {
    UPDATE_EDITPRODUCT,
    UPDATE_EDITPRODUCT_FIELD,
    PUT_EDITPRODUCT_REQUEST,
    PUT_EDITPRODUCT_SUCCESS,
    PUT_EDITPRODUCT_FAILURE,
    RESET_EDITPRODUCT,
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
    [UPDATE_EDITPRODUCT]: (state, action: EditProductAction) => ({
        ...state,
        product: {
            ...action.payload.product,
        },
    }),

    [UPDATE_EDITPRODUCT_FIELD]: (state, action: EditProductFieldAction) => ({
        ...state,
        product: {
            ...state.product,
            [action.payload.field]: action.payload.data,
        },
    }),

    [RESET_EDITPRODUCT]: () => ({
        ...initialState,
    }),

    [PUT_EDITPRODUCT_REQUEST]: (state: EditProductState) => ({
        ...state,
        sending: true,
    }),

    [PUT_EDITPRODUCT_SUCCESS]: (state: EditProductState) => ({
        ...state,
        sending: false,
    }),

    [PUT_EDITPRODUCT_FAILURE]: (state: EditProductState, action: EditProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
    }),
}, initialState)

export default reducer
