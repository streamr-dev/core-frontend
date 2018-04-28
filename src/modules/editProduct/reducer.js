// @flow

import { handleActions } from 'redux-actions'

import type { CreateProductState as EditProductState } from '../../flowtype/store-state'
import { transactionStates } from '../../utils/constants'
import {
    UPDATE_EDIT_PRODUCT,
    UPDATE_EDIT_PRODUCT_FIELD,
    PUT_EDIT_PRODUCT_REQUEST,
    PUT_EDIT_PRODUCT_SUCCESS,
    PUT_EDIT_PRODUCT_FAILURE,
    RESET_EDIT_PRODUCT,
} from './constants'
import type { EditProductFieldAction, EditProductAction, EditProductErrorAction } from './types'

const initialState = {
    product: null,
    sending: false,
    error: null,
    transactionState: null,
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
        transactionStates: transactionStates.STARTED,
    }),

    [PUT_EDIT_PRODUCT_SUCCESS]: (state: EditProductState) => ({
        ...state,
        sending: false,
        transactionStates: transactionStates.FAILED,
    }),

    [PUT_EDIT_PRODUCT_FAILURE]: (state: EditProductState, action: EditProductErrorAction) => ({
        ...state,
        sending: false,
        error: action.payload.error,
        transactionStates: transactionStates.CONFIRMED,
    }),
}, initialState)

export default reducer
