// @flow

import axios from 'axios'
import createApiUrl from './utils/createApiUrl'
import {getData, getError} from './utils/parseApiResponse'

export const GET_PRODUCTS_REQUEST = 'GET_PRODUCTS_REQUEST'
export const GET_PRODUCTS_SUCCESS = 'GET_PRODUCTS_SUCCESS'
export const GET_PRODUCTS_FAILURE = 'GET_PRODUCTS_FAILURE'

export const GET_PRODUCT_BY_ID_REQUEST = 'GET_PRODUCT_BY_ID_REQUEST'
export const GET_PRODUCT_BY_ID_SUCCESS = 'GET_PRODUCT_BY_ID_SUCCESS'
export const GET_PRODUCT_BY_ID_FAILURE = 'GET_PRODUCT_BY_ID_FAILURE'

import type {Product} from '../flowtype/product-types'
import type {ErrorInUi} from '../flowtype/common-types'

export const getProducts = () => async (dispatch: Function) => {
    dispatch(getProductsRequest())
    try {
        const res = await axios.get(createApiUrl('products'))
        dispatch(getProductsSuccess(getData(res)))
    } catch (res) {
        dispatch(getProductsFailure(getError(res)))
    }
}

export const getProductById = (id: $ElementType<Product, 'id'>) => async (dispatch: Function) => {
    dispatch(getProductByIdRequest(id))
    try {
        const res = await axios.get(createApiUrl('products', id))
        dispatch(getProductByIdSuccess(getData(res)))
    } catch (res) {
        dispatch(getProductByIdFailure(id, getError(res)))
    }
}

const getProductsRequest = () => ({
    type: GET_PRODUCTS_REQUEST
})

export const getProductsSuccess = (products: Array<Product>) => ({
    type: GET_PRODUCTS_SUCCESS,
    products
})

const getProductsFailure = (error: ErrorInUi) => ({
    type: GET_PRODUCTS_FAILURE,
    error
})

const getProductByIdRequest = (id: $ElementType<Product, 'id'>) => ({
    type: GET_PRODUCT_BY_ID_REQUEST,
    id
})

const getProductByIdSuccess = (product: Product) => ({
    type: GET_PRODUCT_BY_ID_SUCCESS,
    product
})

const getProductByIdFailure = (id: $ElementType<Product, 'id'>, error: ErrorInUi) => ({
    type: GET_PRODUCT_BY_ID_FAILURE,
    id,
    error
})
