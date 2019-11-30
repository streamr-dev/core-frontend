// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product, ProductId } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { productsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import * as api from './services'
import {
    GET_RELATED_PRODUCTS_REQUEST,
    GET_RELATED_PRODUCTS_SUCCESS,
    GET_RELATED_PRODUCTS_FAILURE,
} from './constants'
import type {
    RelatedProductsActionCreator,
    RelatedProductsErrorActionCreator,
} from './types'

export const getRelatedProductsRequest: ReduxActionCreator = createAction(GET_RELATED_PRODUCTS_REQUEST)

export const getRelatedProductsSuccess: RelatedProductsActionCreator = createAction(GET_RELATED_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getRelatedProductsFailure: RelatedProductsErrorActionCreator = createAction(GET_RELATED_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getRelatedProducts = (id: ProductId, useAuthorization: boolean = true) => (dispatch: Function) => {
    dispatch(getRelatedProductsRequest())
    return api.getRelatedProducts(id, useAuthorization)
        .then((data) => {
            const { result, entities } = normalize(data, productsSchema)
            dispatch(updateEntities(entities))
            return result
        })
        .then((result) => {
            dispatch(getRelatedProductsSuccess(result))
        }, (error) => {
            dispatch(getRelatedProductsFailure(error))
        })
}
