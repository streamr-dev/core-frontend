// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import * as api from './services'

import {
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
} from './constants'
import type { ProductIdActionCreator, ProductErrorActionCreator } from '../product/types'
import type { StreamIdsByProductIdActionCreator } from './types'
import type { ProductId } from '../../flowtype/product-types'
import type { StreamIdList } from '../../flowtype/stream-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import { updateEntities } from '../entities/actions'
import { streamsSchema } from '../entities/schema'

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

export const getStreamsByProductId = (id: ProductId) => (dispatch: Function) => {
    dispatch(getStreamsByProductIdRequest(id))
    return api.getStreamByProductId(id)
        .then((data) => {
            const { result, entities } = normalize(data, streamsSchema)

            dispatch(updateEntities(entities))
            dispatch(getStreamsByProductIdSuccess(id, result))
        })
        .catch((error) => dispatch(getStreamsByProductIdFailure(id, error)))
}
