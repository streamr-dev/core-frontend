// @flow
import { createAction } from 'redux-actions'
import * as api from './services'

import { 
    GET_PRODUCTS_REQUEST, 
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
} from './constants'
import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

export const getProductsRequest = createAction(GET_PRODUCTS_REQUEST)

export const getProductsSuccess = createAction(GET_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getProductsFailure = createAction(GET_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getProductByIdRequest = createAction(
    GET_PRODUCT_BY_ID_REQUEST, 
    (id: $ElementType<Product, 'id'>) => ({
        id,
    })
)

export const getProductByIdSuccess = createAction(
    GET_PRODUCT_BY_ID_SUCCESS, 
    (product: Product) => ({
        product,
    })
)

export const getProductByIdFailure = createAction(
    GET_PRODUCT_BY_ID_FAILURE, 
    (id: $ElementType<Product, 'id'>, error: ErrorInUi) => ({
        id,
        error
    })
)

export const getProducts = () => (dispatch: Function) => {
    dispatch(getProductsRequest())
    return api.getProducts()
        .then((data) => dispatch(getProductsSuccess(data)))
        .catch((error) => dispatch(getProductsFailure(error)))
}

export const getProductById = (id: $ElementType<Product, 'id'>) => (dispatch: Function) => {
    dispatch(getProductByIdRequest(id))
    return api.getProductById(id)
        .then((data) => dispatch(getProductByIdSuccess(data)))
        .catch((error) => dispatch(getProductByIdFailure(id, error)))
}
