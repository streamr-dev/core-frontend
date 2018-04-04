// @flow
import { createAction } from 'redux-actions'
import { push } from 'react-router-redux'

import { putProduct } from './services'
import { selectEditProduct } from './selectors'
import { selectProduct } from '../../modules/product/selectors'
import links from '../../links'
import { formatPath } from '../../utils/url'

import {
    UPDATE_EDITPRODUCT,
    UPDATE_EDITPRODUCT_FIELD,
    PUT_EDITPRODUCT_REQUEST,
    PUT_EDITPRODUCT_SUCCESS,
    PUT_EDITPRODUCT_FAILURE,
    RESET_EDITPRODUCT
} from './constants'

import type {
    EditProductFieldActionCreator,
    ProductErrorActionCreator
} from './types'
import type { ReduxActionCreator, ErrorFromApi } from '../../flowtype/common-types'

export const updateEditProduct = createAction( // TODO fix up this type.. EditProductActionCreator (types)
    UPDATE_EDITPRODUCT, (product: any) => ({
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

export const putEditProductError: ProductErrorActionCreator = createAction(
    PUT_EDITPRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    })
)

export const initEditProduct = () => (dispatch: Function, getState: Function) => {
    setTimeout(() => { // TODO For now we slow this down until we sync with getProductId.
        const product = selectProduct(getState())
        const editProduct = !!product && ({
            name: product.name ? product.name : '',
            description: product.description ? product.description : '',
            category: product.category ? product.category : '',
            streams: product.streams ? product.streams : [],
        })
        dispatch(updateEditProduct(editProduct))
    }, 3000)
}

export const saveAndRedirect = () => (dispatch: Function, getState: Function) => {
    dispatch(putEditProductRequest())
    const product = selectProduct(getState())
    const editProduct = selectEditProduct(getState())
    return !!product && putProduct(editProduct, '2')
        .then((data) => {
            // const { result, entities } = normalize(data, productSchema) TODO not sure if these needs to be done.
            dispatch(putEditProductSuccess())
            dispatch(push(formatPath(links.products)))
            dispatch(resetEditProduct())
        })
        .catch((error) => dispatch(putEditProductError(error)))
}
