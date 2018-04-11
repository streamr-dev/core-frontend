// @flow

import { createAction } from 'redux-actions'
import { push } from 'react-router-redux'
import { normalize } from 'normalizr'

import { putProduct } from './services'
import { selectEditProduct } from './selectors'
import { selectProduct } from '../../modules/product/selectors'
import { productSchema } from '../../modules/entities/schema'
import { updateEntities } from '../../modules/entities/actions'

import {
    UPDATE_EDIT_PRODUCT,
    UPDATE_EDIT_PRODUCT_FIELD,
    PUT_EDIT_PRODUCT_REQUEST,
    PUT_EDIT_PRODUCT_SUCCESS,
    PUT_EDIT_PRODUCT_FAILURE,
    RESET_EDIT_PRODUCT,
} from './constants'

import type {
    EditProductActionCreator,
    EditProductFieldActionCreator,
    EditProductErrorActionCreator,
} from './types'
import type { EditProduct } from '../../flowtype/product-types'
import type { ReduxActionCreator, ErrorFromApi } from '../../flowtype/common-types'

export const updateEditProduct: EditProductActionCreator = createAction(
    UPDATE_EDIT_PRODUCT,
    (product: EditProduct) => ({
        product,
    }),
)

export const updateEditProductField: EditProductFieldActionCreator = createAction(
    UPDATE_EDIT_PRODUCT_FIELD,
    (field: string, data: any) => ({
        field,
        data,
    }),
)

export const resetEditProduct: ReduxActionCreator = createAction(RESET_EDIT_PRODUCT)

export const putEditProductRequest: ReduxActionCreator = createAction(PUT_EDIT_PRODUCT_REQUEST)

export const putEditProductSuccess: ReduxActionCreator = createAction(PUT_EDIT_PRODUCT_SUCCESS)

export const putEditProductError: EditProductErrorActionCreator = createAction(
    PUT_EDIT_PRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    }),
)

export const initEditProduct = () => (dispatch: Function, getState: Function) => {
    const product = selectProduct(getState())
    return !!product && dispatch(updateEditProduct({
        name: product.name ? product.name : '',
        description: product.description ? product.description : '',
        category: product.category ? product.category : '',
        streams: product.streams ? product.streams : [],
    }))
}

export const updateEditProductAndRedirect = (redirectPath: string) => (dispatch: Function, getState: Function) => {
    dispatch(putEditProductRequest())
    const product = selectProduct(getState())
    const editProduct = selectEditProduct(getState())
    return !!product && putProduct(editProduct, product.id || '')
        .then((data) => {
            const { entities } = normalize(data, productSchema)
            dispatch(updateEntities(entities))
            dispatch(putEditProductSuccess())
            dispatch(resetEditProduct())
            dispatch(push(redirectPath))
        })
        .catch((error) => dispatch(putEditProductError(error)))
}
