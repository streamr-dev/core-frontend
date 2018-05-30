// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import { myProductsSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import * as api from './services'
import {
    GET_MY_PRODUCTS_REQUEST,
    GET_MY_PRODUCTS_SUCCESS,
    GET_MY_PRODUCTS_FAILURE,
} from './constants'
import type {
    MyProductsActionCreator,
    MyProductsErrorActionCreator,
} from './types'

export const getMyProductsRequest: ReduxActionCreator = createAction(GET_MY_PRODUCTS_REQUEST)

export const getMyProductsSuccess: MyProductsActionCreator = createAction(GET_MY_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getMyProductsFailure: MyProductsErrorActionCreator = createAction(GET_MY_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

const handleProductActionLifetime = (dispatch: Function, getMyProducts) => {
    dispatch(getMyProductsRequest())
    return getMyProducts
        .then((data) => {
            const { result, entities } = normalize(data, myProductsSchema)
            dispatch(updateEntities(entities))
            dispatch(getMyProductsSuccess(result))
        }, (error) => dispatch(getMyProductsFailure(error)))
}

export const getMyProducts = (dispatch: Function) => handleProductActionLifetime(dispatch, api.getMyProducts())
