// @flow
import { createAction } from 'redux-actions'
import * as api from './services'

import {
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILURE,
    GET_PRODUCTS_BY_CATEGORY_REQUEST,
    GET_PRODUCTS_BY_CATEGORY_SUCCESS,
    GET_PRODUCTS_BY_CATEGORY_FAILURE,
} from './constants'
import type { Category } from '../../flowtype/category-types'
import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

export const getCategoriesRequest = createAction(GET_CATEGORIES_REQUEST)

export const getCategoriesSuccess = createAction(GET_CATEGORIES_SUCCESS, (categories: Array<Category>) => ({
    categories,
}))

export const getCategoriesFailure = createAction(GET_CATEGORIES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getProductsByCategoryRequest = createAction(GET_PRODUCTS_BY_CATEGORY_REQUEST,
    (id: $ElementType<Category, 'id'>) => ({
        id,
    })
)

export const getProductsByCategorySuccess = createAction(GET_PRODUCTS_BY_CATEGORY_SUCCESS,
    (id: $ElementType<Category, 'id'>, products: Array<Product>) => ({
        id,
        products,
    })
)

export const getProductsByCategoryFailure = createAction(GET_PRODUCTS_BY_CATEGORY_FAILURE,
    (id: $ElementType<Category, 'id'>, error: ErrorInUi) => ({
        type: GET_PRODUCTS_BY_CATEGORY_FAILURE,
        id,
        error
    })
)

export const getCategories = () => (dispatch: Function) => {
    dispatch(getCategoriesRequest())
    return api.getCategories()
        .then((data) => dispatch(getCategoriesSuccess(data)))
        .catch((error) => dispatch(getCategoriesFailure(error)))
}

export const getProductsByCategory = (id: $ElementType<Category, 'id'>) => async (dispatch: Function) => {
    dispatch(getProductsByCategoryRequest(id))
    return api.getProductsByCategories(id)
        .then((data) => dispatch(getProductsByCategorySuccess(id, data)))
        .catch((error) => dispatch(getProductsByCategoryFailure(id, error)))
}
