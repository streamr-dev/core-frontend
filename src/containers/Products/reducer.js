// @flow
import { handleActions } from 'redux-actions'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE
} from './constants'
import type {ProductState} from '../../flowtype/store-state'
import type {
    ProductIdAction, 
    ProductsAction,
    ProductAction,
    ProductsErrorAction,
} from './types'

const initialState: ProductState = {
    byId: {},
    fetching: false,
    error: null
}

const reducer = handleActions({
    [GET_PRODUCTS_REQUEST]: (state: ProductState): ProductState => ({
        ...state,
        fetching: true
    }),

    [GET_PRODUCT_BY_ID_REQUEST]: (state: ProductState, action: ProductIdAction) => ({
        ...state,
        byId: {
            ...state.byId,
            [action.payload.id]: {
                ...(state.byId[action.payload.id] || {}),
                fetching: true
            }
        }
    }),

    [GET_PRODUCTS_SUCCESS]: (state: ProductState, action: ProductsAction) => ({
        ...state,
        byId: action.payload.products.reduce((acc, curr) => ({
            ...acc,
            [curr.id]: curr
        }), {}),
        fetching: false
    }),

    [GET_PRODUCT_BY_ID_SUCCESS]: (state: ProductState, action: ProductAction) => ({
        ...state,
        byId: {
            ...state.byId,
            [action.payload.product.id]: action.payload.product
        }
    }),

    [GET_PRODUCTS_FAILURE]: (state: ProductState, action: ProductsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error
    }),

    [GET_PRODUCT_BY_ID_FAILURE]: (state: ProductState, action: ProductIdAction) => {
        const newById = {
            ...state.byId
        }
        const product = newById[action.payload.id]
        if (product.fetching && Object.keys(product).length === 1) {
            delete newById[action.payload.id]
        } else {
            product.fetching = false
        }
        return {
            ...state,
            byId: {
                ...state.byId
            }
        }
    },

}, initialState)

export default reducer
