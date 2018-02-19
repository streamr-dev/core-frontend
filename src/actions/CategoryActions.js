// @flow

import axios from 'axios'
import apiUrl from './utils/createApiUrl'
import {getData, getError} from './utils/parseApiResponse'
// import {getProductsSuccess} from './ProductActions'

export const GET_CATEGORIES_REQUEST = 'GET_CATEGORIES_REQUEST'
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS'
export const GET_CATEGORIES_FAILURE = 'GET_CATEGORIES_FAILURE'

export const GET_PRODUCTS_BY_CATEGORY_REQUEST = 'GET_PRODUCTS_BY_CATEGORY_REQUEST'
export const GET_PRODUCTS_BY_CATEGORY_SUCCESS = 'GET_PRODUCTS_BY_CATEGORY_SUCCESS'
export const GET_PRODUCTS_BY_CATEGORY_FAILURE = 'GET_PRODUCTS_BY_CATEGORY_FAILURE'

import type {Product} from '../flowtype/product-types'
import type {Category} from '../flowtype/category-types'
import type {ErrorInUi} from '../flowtype/common-types'

export const getCategories = () => (dispatch: Function) => {
    dispatch(getCategoriesRequest())
    return axios.get(apiUrl('categories'))
        .then((res) => dispatch(getCategoriesSuccess(getData(res))))
        .catch((res) => dispatch(getCategoriesFailure(getError(res))))
}

export const getProductsByCategory = (id: $ElementType<Category, 'id'>) => async (dispatch: Function) => {
    dispatch(getProductsByCategoryRequest(id))
    return axios.get(apiUrl('categories', id, 'products'))
        .then((res) => dispatch(getProductsByCategorySuccess(id, getData(res))))
        .catch((res) => dispatch(getProductsByCategoryFailure(id, getError(res))))
}

const getCategoriesRequest = () => ({
    type: GET_CATEGORIES_REQUEST
})

const getCategoriesSuccess = (categories: Array<Category>) => ({
    type: GET_CATEGORIES_SUCCESS,
    categories
})

const getCategoriesFailure = (error: ErrorInUi) => ({
    type: GET_CATEGORIES_FAILURE,
    error
})

const getProductsByCategoryRequest = (id: $ElementType<Category, 'id'>) => ({
    type: GET_PRODUCTS_BY_CATEGORY_REQUEST,
    id
})

const getProductsByCategorySuccess = (id: $ElementType<Category, 'id'>, products: Array<Product>) => ({
    type: GET_PRODUCTS_BY_CATEGORY_SUCCESS,
    id,
    products
})

const getProductsByCategoryFailure = (id: $ElementType<Category, 'id'>, error: ErrorInUi) => ({
    type: GET_PRODUCTS_BY_CATEGORY_FAILURE,
    id,
    error
})
