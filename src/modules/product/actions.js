// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import * as api from './services'

import {
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
} from './constants'
import type { ProductIdActionCreator, ProductErrorActionCreator } from './types'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import { productSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'

export const getProductByIdRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_BY_ID_REQUEST,
    (id: ProductId) => ({
        id,
    })
)

export const getProductByIdSuccess: ProductIdActionCreator = createAction(
    GET_PRODUCT_BY_ID_SUCCESS,
    (id: ProductId) => ({
        id,
    })
)

export const getProductByIdFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_BY_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error
    })
)

export const getProductById = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductByIdRequest(id))
    return api.getProductById(id)
        .then((data) => {
            const { result, entities } = normalize(data, productSchema)

            dispatch(updateEntities(entities))
            dispatch(getProductByIdSuccess(result))
        })
        .catch((error) => dispatch(getProductByIdFailure(id, error)))
}
