// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import debounce from 'lodash/debounce'

import { productsSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import type {
    Product,
    ProductList,
    Filter,
} from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'

import { selectFilter } from './selectors'
import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
} from './constants'
import * as api from './services'
import type {
    ProductsActionCreator,
    ProductsErrorActionCreator,
    FilterActionCreator,
} from './types'

export const getProductsRequest: ReduxActionCreator = createAction(GET_PRODUCTS_REQUEST)

export const getProductsSuccess: ProductsActionCreator = createAction(GET_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getProductsFailure: ProductsErrorActionCreator = createAction(GET_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const updateFilter: FilterActionCreator = createAction(UPDATE_FILTER, (filter: Filter) => ({
    filter,
}))

export const clearFilters: ReduxActionCreator = createAction(CLEAR_FILTERS)

const handleProductActionLifetime = (dispatch: Function, getProducts: Promise<ProductList>) => {
    dispatch(getProductsRequest())
    return getProducts
        .then((data) => {
            const { result, entities } = normalize(data, productsSchema)

            dispatch(updateEntities(entities))
            dispatch(getProductsSuccess(result))
        })
        .catch((error) => dispatch(getProductsFailure(error)))
}

// We need to define the debounced fetch here so that we have only one reference to it
// https://gist.github.com/krstffr/245fe83885b597aabaf06348220c2fe9
const getProductsDebounced = debounce((dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const filter = selectFilter(state)

    return handleProductActionLifetime(dispatch, api.getProducts(filter))
}, 500)

// Using debounced fetch because this action is dispatched when user is typing
export const getProducts = () => getProductsDebounced
