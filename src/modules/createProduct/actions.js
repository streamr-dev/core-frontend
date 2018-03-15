// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import {
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FIELD,
    RESET_PRODUCT,
    POST_PRODUCT_REQUEST,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
} from './constants'
import { selectProduct } from './selectors'
import * as api from './services'
import { productSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import { push } from 'react-router-redux'

import type {
    ProductActionCreator,
    UpdateProductFieldActionCreator,
    ProductErrorActionCreator,
} from './types'
import type { Product } from '../../flowtype/product-types'
import type { ReduxActionCreator, ErrorFromApi } from '../../flowtype/common-types'
import links from '../../links'

export const updateProduct: ProductActionCreator = createAction(
    UPDATE_PRODUCT, (product: Product) => ({
        product,
    })
)

export const updateProductField: UpdateProductFieldActionCreator = createAction(
    UPDATE_PRODUCT_FIELD,
    (field: string, data: any) => ({
        field,
        data,
    })
)

export const resetProduct: ReduxActionCreator = createAction(
    RESET_PRODUCT
)

export const postProductRequest: ReduxActionCreator = createAction(
    POST_PRODUCT_REQUEST
)

export const postProductSuccess: ReduxActionCreator = createAction(
    POST_PRODUCT_SUCCESS,
)

export const postProductError: ProductErrorActionCreator = createAction(
    POST_PRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    })
)

export const createProduct = () => (dispatch: Function, getState: Function) => {
    dispatch(postProductRequest())

    const product = selectProduct(getState())

    return api.postProduct(product)
        .then((data) => {
            const { result, entities } = normalize(data, productSchema)

            dispatch(updateEntities(entities))
            dispatch(postProductSuccess())
            dispatch(resetProduct())

            dispatch(push(`${links.products}/${result}`))
        })
        .catch((error) => dispatch(postProductError(error)))
}
