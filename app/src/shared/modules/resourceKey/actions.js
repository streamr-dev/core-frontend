// @flow

import { createAction } from 'redux-actions'

import * as services from './services'

import type { ResourceKeyIdList } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { resourceKeysSchema } from '$shared/modules/entities/schema'

// "STREAM_RESOURCE_KEY": stream API key
import {
    GET_RESOURCE_KEYS_REQUEST,
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    GET_RESOURCE_KEYS_FAILURE,
} from './constants'
import type {
    StreamResourceKeysActionCreator,
    ResourceKeysErrorActionCreator,
} from './types'

const getResourceKeysRequest: ReduxActionCreator = createAction(GET_RESOURCE_KEYS_REQUEST)

const getStreamResourceKeysSuccess: StreamResourceKeysActionCreator = createAction(
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    (id: StreamId, keys: ResourceKeyIdList) => ({
        id,
        keys,
    }),
)

const getResourceKeysFailure: ResourceKeysErrorActionCreator = createAction(
    GET_RESOURCE_KEYS_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const getStreamResourceKeys = (id: StreamId) => (dispatch: Function) => {
    dispatch(getResourceKeysRequest())
    return services.getStreamResourceKeys(id)
        .then((data) => data.map((key) => ({
            ...key,
            type: 'STREAM',
        })))
        .then(handleEntities(resourceKeysSchema, dispatch))
        .then((result) => dispatch(getStreamResourceKeysSuccess(id, result)))
        .catch((e) => {
            const error = {
                title: 'Error!',
                message: e.message,
            }
            dispatch(getResourceKeysFailure(error))
            throw e
        })
}
