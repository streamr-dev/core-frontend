// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import * as api from './services'

import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_SEARCH_TEXT,
    UPDATE_CATEGORY,
} from './constants'
import type {
    ProductsActionCreator,
    ProductsErrorActionCreator,
    SearchTextActionCreator,
    CategoryActionCreator,
} from './types'
import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import { productsSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'

export const getProductsRequest: ReduxActionCreator = createAction(GET_PRODUCTS_REQUEST)

export const getProductsSuccess: ProductsActionCreator = createAction(GET_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getProductsFailure: ProductsErrorActionCreator = createAction(GET_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const updateSearchText: SearchTextActionCreator = createAction(UPDATE_SEARCH_TEXT, (text: string) => ({
    text,
}))

export const updateCategory: CategoryActionCreator = createAction(UPDATE_CATEGORY, (category: ?string) => ({
    category,
}))

export const getProducts = () => (dispatch: Function) => {
    dispatch(getProductsRequest())
    return api.getProducts()
        .then((data) => {
            const { result, entities } = normalize(data, productsSchema)

            dispatch(updateEntities(entities))
            dispatch(getProductsSuccess(result))
        })
        .catch((error) => dispatch(getProductsFailure(error)))
}
