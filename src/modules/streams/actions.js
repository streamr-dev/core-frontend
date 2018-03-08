// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import * as api from './services'

import {
    GET_STREAM_BY_ID_REQUEST,
    GET_STREAM_BY_ID_SUCCESS,
    GET_STREAM_BY_ID_FAILURE,
} from './constants'
import type { StreamIdActionCreator, StreamErrorActionCreator } from './types'
import type { StreamId } from '../../flowtype/stream-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import { updateEntities } from '../entities/actions'
import { streamSchema } from '../entities/schema'

export const getStreamByIdRequest: StreamIdActionCreator = createAction(
    GET_STREAM_BY_ID_REQUEST,
    (id: StreamId) => ({
        id,
    })
)

export const getStreamByIdSuccess: StreamIdActionCreator = createAction(
    GET_STREAM_BY_ID_SUCCESS,
    (id: StreamId) => ({
        id,
    })
)

export const getStreamByIdFailure: StreamErrorActionCreator = createAction(
    GET_STREAM_BY_ID_FAILURE,
    (id: StreamId, error: ErrorInUi) => ({
        id,
        error
    })
)

export const getStreamById = (id: StreamId) => (dispatch: Function) => {
    dispatch(getStreamByIdRequest(id))
    return api.getStreamById(id)
        .then((data) => {
            const { result, entities } = normalize(data, streamSchema)

            dispatch(updateEntities(entities))
            dispatch(getStreamByIdSuccess(result))
        })
        .catch((error) => dispatch(getStreamByIdFailure(id, error)))
}
