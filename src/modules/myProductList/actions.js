// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import { productsSchema } from '../entities/schema'
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

const getMyProductsRequest: ReduxActionCreator = createAction(GET_MY_PRODUCTS_REQUEST)

const getMyProductsSuccess: MyProductsActionCreator = createAction(GET_MY_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

const getMyProductsFailure: MyProductsErrorActionCreator = createAction(GET_MY_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getMyProducts = () => (dispatch: Function) => {
    dispatch(getMyProductsRequest())
    return api.getMyProducts()
        .then((data) => {
            const { result, entities } = normalize(data, productsSchema)
            dispatch(updateEntities(entities))
            dispatch(getMyProductsSuccess(result))
        }, (error) => dispatch(getMyProductsFailure(error)))
}
