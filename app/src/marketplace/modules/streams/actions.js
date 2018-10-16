// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import { streamsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { StreamList } from '$shared/flowtype/stream-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'

import * as api from './services'
import {
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
} from './constants'
import type {
    StreamsActionCreator,
    StreamsErrorActionCreator,
} from './types'

const getStreamsRequest: ReduxActionCreator = createAction(GET_STREAMS_REQUEST)

const getStreamsSuccess: StreamsActionCreator = createAction(GET_STREAMS_SUCCESS, (streams: StreamList) => ({
    streams,
}))

const getStreamsFailure: StreamsErrorActionCreator = createAction(GET_STREAMS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getStreams = () => (dispatch: Function) => {
    dispatch(getStreamsRequest())
    return api.getStreams()
        .then((data) => {
            const { result, entities } = normalize(data, streamsSchema)
            dispatch(updateEntities(entities))
            return result
        })
        .then((result) => {
            dispatch(getStreamsSuccess(result))
        }, (error) => {
            dispatch(getStreamsFailure(error))
        })
}
