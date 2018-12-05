// @flow

import { handleActions } from 'redux-actions'

import type { EditProductState } from '$mp/flowtype/store-state'
import { transactionStates } from '$shared/utils/constants'
import {
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FIELD,
    PUT_PRODUCT_REQUEST,
    PUT_PRODUCT_SUCCESS,
    PUT_PRODUCT_FAILURE,
    RESET_PRODUCT,
    POST_PRODUCT_REQUEST,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
    IMAGE_UPLOAD_SET_IMAGE,
    IMAGE_UPLOAD_REQUEST,
    IMAGE_UPLOAD_SUCCESS,
    IMAGE_UPLOAD_FAILURE,
    PUT_PRODUCT_RESET,
} from './constants'
import type {
    EditProductFieldAction,
    EditProductAction,
    EditProductErrorAction,
    ImageAction,
    ImageErrorAction,
} from './types'

export const initialState = {
    product: null,
    sending: false,
    error: null,
    transactionState: null,
    imageToUpload: null,
    imageError: null,
    uploadingImage: false,
}

const reducer: (EditProductState) => EditProductState = handleActions({
    [UPDATE_PRODUCT]: (state, action: EditProductAction) => ({
        ...state,
        product: {
            ...action.payload.product,
        },
    }),

    [UPDATE_PRODUCT_FIELD]: (state, action: EditProductFieldAction) => ({
        ...state,
        product: {
            ...state.product,
            [action.payload.field]: action.payload.data,
        },
    }),

    [RESET_PRODUCT]: () => ({
        ...initialState,
    }),

    [PUT_PRODUCT_REQUEST]: (state: EditProductState) => ({
        ...state,
        sending: true,
        transactionState: transactionStates.STARTED,
    }),

    [PUT_PRODUCT_SUCCESS]: (state: EditProductState) => ({
        ...state,
        sending: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [PUT_PRODUCT_FAILURE]: (state: EditProductState, action: EditProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
        transactionState: transactionStates.FAILED,
    }),

    [PUT_PRODUCT_RESET]: (state: EditProductState) => ({
        ...state,
        sending: false,
        error: null,
        transactionState: null,
    }),

    [POST_PRODUCT_REQUEST]: (state: EditProductState) => ({
        ...state,
        sending: true,
    }),

    [POST_PRODUCT_SUCCESS]: (state: EditProductState) => ({
        ...state,
        sending: false,
    }),

    [POST_PRODUCT_FAILURE]: (state: EditProductState, action: EditProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
    }),

    [IMAGE_UPLOAD_SET_IMAGE]: (state: EditProductState, action: ImageAction) => ({
        ...state,
        imageToUpload: action.payload.image,
    }),

    [IMAGE_UPLOAD_REQUEST]: (state: EditProductState) => ({
        ...state,
        uploadingImage: true,
    }),

    [IMAGE_UPLOAD_SUCCESS]: (state: EditProductState) => ({
        ...state,
        uploadingImage: false,
        imageError: null,
        imageToUpload: null,
    }),

    [IMAGE_UPLOAD_FAILURE]: (state: EditProductState, action: ImageErrorAction) => ({
        ...state,
        uploadingImage: false,
        imageError: action.payload.error,
    }),
}, initialState)

export default reducer
