// @flow

import { handleActions } from 'redux-actions'

import type { CreateProductState } from '../../flowtype/store-state'

import {
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FIELD,
    RESET_PRODUCT,
    POST_PRODUCT_REQUEST,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
    IMAGE_UPLOAD_SET_IMAGE,
    IMAGE_UPLOAD_REQUEST,
    IMAGE_UPLOAD_SUCCESS,
    IMAGE_UPLOAD_FAILURE,
} from './constants'
import type {
    UpdateProductFieldAction,
    ProductAction,
    ProductErrorAction,
    ImageAction,
    ImageErrorAction,
} from './types'

const initialState: CreateProductState = {
    product: null,
    sending: false,
    error: null,
    imageToUpload: null,
    imageError: null,
    uploadingImage: false,
}

const reducer: (CreateProductState) => CreateProductState = handleActions({
    [UPDATE_PRODUCT]: (state: CreateProductState, action: ProductAction) => ({
        ...state.product,
        product: {
            ...state.product,
            ...action.payload.product,
        },
    }),

    [UPDATE_PRODUCT_FIELD]: (state: CreateProductState, action: UpdateProductFieldAction) => ({
        ...state,
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

    [POST_PRODUCT_FAILURE]: (state: CreateProductState, action: ProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
    }),

    [IMAGE_UPLOAD_SET_IMAGE]: (state: CreateProductState, action: ImageAction) => ({
        ...state,
        imageToUpload: action.payload.image,
    }),

    [IMAGE_UPLOAD_REQUEST]: (state: CreateProductState) => ({
        ...state,
        uploadingImage: true,
    }),

    [IMAGE_UPLOAD_SUCCESS]: (state: CreateProductState) => ({
        ...state,
        uploadingImage: false,
        imageError: null,
        imageToUpload: null,
    }),

    [IMAGE_UPLOAD_FAILURE]: (state: CreateProductState, action: ImageErrorAction) => ({
        ...state,
        uploadingImage: false,
        imageError: action.payload.error,
    }),

}, initialState)

export default reducer
