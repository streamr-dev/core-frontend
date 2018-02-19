// @flow

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE
} from '../actions/ProductActions'

import type {ProductState} from '../flowtype/states/product-state'

const defaultState: ProductState = {
    byId: {},
    fetching: false,
    error: null
}

export default (state: ProductState = defaultState, action: any): ProductState => {
    switch (action.type) {
        case GET_PRODUCTS_REQUEST:
            return {
                ...state,
                fetching: true
            }

        case GET_PRODUCT_BY_ID_REQUEST:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.id]: {
                        ...(state.byId[action.id] || {}),
                        fetching: true
                    }
                }
            }

        case GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                byId: action.products.reduce((acc, curr) => ({
                    ...acc,
                    [curr.id]: curr
                }), {}),
                fetching: false
            }

        case GET_PRODUCT_BY_ID_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.product.id]: action.product
                }
            }

        case GET_PRODUCTS_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error
            }

        case GET_PRODUCT_BY_ID_FAILURE: {
            const newById = {
                ...state.byId
            }
            const product = newById[action.id]
            if (product.fetching && Object.keys(product).length === 1) {
                delete newById[action.id]
            } else {
                product.fetching = false
            }
            return {
                ...state,
                byId: {
                    ...state.byId
                }
            }
        }

        default:
            return state
    }
}