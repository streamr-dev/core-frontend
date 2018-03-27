// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import * as api from './services'

import {
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
} from './constants'
import type { ProductIdActionCreator, ProductErrorActionCreator, StreamIdsByProductIdActionCreator } from './types'
import type {StreamIdList} from '../../flowtype/stream-types'
import { selectProduct } from './selectors'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'
import { productSchema, streamsSchema } from '../entities/schema'
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

export const getStreamsByProductIdRequest: ProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    (id: ProductId) => ({
        id,
    })
)

export const getStreamsByProductIdSuccess: StreamIdsByProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    (id: ProductId, streams: StreamIdList) => ({
        id,
        streams,
    })
)

export const getStreamsByProductIdFailure: ProductErrorActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error
    })
)

export const getProductById = (id: ProductId) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getProductByIdRequest(id))
    return api.getProductById(id)
        .then((data) => {
            const { result, entities } = normalize(data, productSchema)

            dispatch(updateEntities(entities))
            dispatch(getProductByIdSuccess(result))

            const product = selectProduct(getState())

            if (product && product.streams) {
                dispatch(getStreamsByProductId(id))
            }
        })
        .catch((error) => dispatch(getProductByIdFailure(id, error)))
}

export const getStreamsByProductId = (id: ProductId) => (dispatch: Function) => {
    dispatch(getStreamsByProductIdRequest(id))
    return api.getStreamsByProductId(id)
        .then((data) => {
            const { result, entities } = normalize(data, streamsSchema)

            dispatch(updateEntities(entities))
            dispatch(getStreamsByProductIdSuccess(id, result))
        })
        .catch((error) => dispatch(getStreamsByProductIdFailure(id, error)))
}

export const toggleProductPublishState = () => (dispatch: Function) => {
    dispatch()
}

export const onSaveExit = () => (dispatch: Function) => {
    dispatch()
}
