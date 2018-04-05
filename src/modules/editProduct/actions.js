// @flow
import { createAction } from 'redux-actions'
import { push } from 'react-router-redux'
import { normalize } from 'normalizr'

import { putProduct } from './services'
import { selectEditProduct } from './selectors'
import { selectProduct } from '../../modules/product/selectors'
import links from '../../links'
import { formatPath } from '../../utils/url'
import { productSchema } from '../../modules/entities/schema'
import { updateEntities } from '../../modules/entities/actions'

import {
    UPDATE_EDITPRODUCT,
    UPDATE_EDITPRODUCT_FIELD,
    PUT_EDITPRODUCT_REQUEST,
    PUT_EDITPRODUCT_SUCCESS,
    PUT_EDITPRODUCT_FAILURE,
    RESET_EDITPRODUCT
} from './constants'

import type {
    EditProductActionCreator,
    EditProductFieldActionCreator,
    EditProductErrorActionCreator
} from './types'
import type { EditProduct } from '../../flowtype/product-types'
import type { ReduxActionCreator, ErrorFromApi } from '../../flowtype/common-types'

export const updateEditProduct = createAction(
    UPDATE_EDITPRODUCT, (product: EditProduct) => ({
        product,
    })
)

export const updateEditProductField: EditProductFieldActionCreator = createAction(
    UPDATE_EDITPRODUCT_FIELD, (field: string, data: any) => ({
        field,
        data,
    })
)

export const resetEditProduct: ReduxActionCreator = createAction(
    RESET_EDITPRODUCT
)

export const putEditProductRequest: ReduxActionCreator = createAction(
    PUT_EDITPRODUCT_REQUEST
)

export const putEditProductSuccess: ReduxActionCreator = createAction(
    PUT_EDITPRODUCT_SUCCESS
)

export const putEditProductError: EditProductErrorActionCreator = createAction(
    PUT_EDITPRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    })
)

export const initEditProduct = () => (dispatch: Function, getState: Function) => {
    const product = selectProduct(getState())
    const editProduct = !!product && ({
        name: product.name ? product.name : '',
        description: product.description ? product.description : '',
        category: product.category ? product.category : '',
        streams: product.streams ? product.streams : [],
    })
    dispatch(updateEditProduct(editProduct))
}

export const saveAndRedirect = () => (dispatch: Function, getState: Function) => {
    dispatch(putEditProductRequest())
    const product = selectProduct(getState())
    const editProduct = selectEditProduct(getState())
    return !!product && putProduct(editProduct, product.id || '')
        .then((data) => {
            const { entities } = normalize(data, productSchema)
            dispatch(updateEntities(entities))
            dispatch(putEditProductSuccess())
            dispatch(resetEditProduct())
            dispatch(push(formatPath(links.main)))
        })
        .catch((error) => dispatch(putEditProductError(error)))
}
