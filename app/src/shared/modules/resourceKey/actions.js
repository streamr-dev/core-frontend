// @flow

import { createAction } from 'redux-actions'

import * as services from './services'

import type {
    ResourceKeyId,
    ResourceKeyIdList,
    ResourcePermission,
} from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { resourceKeysSchema, resourceKeySchema } from '$shared/modules/entities/schema'

// "STREAM_RESOURCE_KEY": stream API key
import {
    GET_RESOURCE_KEYS_REQUEST,
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    GET_RESOURCE_KEYS_FAILURE,
    ADD_RESOURCE_KEY_REQUEST,
    ADD_STREAM_RESOURCE_KEY_SUCCESS,
    ADD_RESOURCE_KEY_FAILURE,
    REMOVE_RESOURCE_KEY_REQUEST,
    REMOVE_STREAM_RESOURCE_KEY_SUCCESS,
    REMOVE_RESOURCE_KEY_FAILURE,
    EDIT_STREAM_RESOURCE_KEY_REQUEST,
    EDIT_STREAM_RESOURCE_KEY_SUCCESS,
    EDIT_STREAM_RESOURCE_KEY_FAILURE,
} from './constants'
import type {
    StreamResourceKeysActionCreator,
    StreamResourceKeyActionCreator,
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

const addResourceKeyRequest: ReduxActionCreator = createAction(ADD_RESOURCE_KEY_REQUEST)

const addStreamResourceKeySuccess: StreamResourceKeyActionCreator = createAction(
    ADD_STREAM_RESOURCE_KEY_SUCCESS,
    (id: StreamId, key: ResourceKeyId) => ({
        id,
        key,
    }),
)

const addResourceKeyFailure: ResourceKeysErrorActionCreator = createAction(
    ADD_RESOURCE_KEY_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

const removeResourceKeyRequest: ReduxActionCreator = createAction(REMOVE_RESOURCE_KEY_REQUEST)

const removeStreamResourceKeySuccess: StreamResourceKeyActionCreator = createAction(
    REMOVE_STREAM_RESOURCE_KEY_SUCCESS,
    (id: StreamId, key: ResourceKeyId) => ({
        id,
        key,
    }),
)

const removeResourceKeyFailure: ResourceKeysErrorActionCreator = createAction(
    REMOVE_RESOURCE_KEY_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

const editStreamResourceKeyRequest: ReduxActionCreator = createAction(EDIT_STREAM_RESOURCE_KEY_REQUEST)

const editStreamResourceKeySuccess: StreamResourceKeyActionCreator = createAction(
    EDIT_STREAM_RESOURCE_KEY_SUCCESS,
    (streamId: StreamId, resourceKeyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission) => ({
        id: streamId,
        key: resourceKeyId,
        name: keyName,
        permission: keyPermission,
    }),
)

const editStreamResourceKeyFailure: ResourceKeysErrorActionCreator = createAction(
    EDIT_STREAM_RESOURCE_KEY_FAILURE,
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

export const addStreamResourceKey = (id: StreamId, name: string, permission: ResourcePermission) => (dispatch: Function) => {
    dispatch(addResourceKeyRequest())
    return services.addStreamResourceKey(id, name, permission)
        .then((data) => ({
            ...data,
            type: 'STREAM',
        }))
        .then(handleEntities(resourceKeySchema, dispatch))
        .then((result) => {
            dispatch(addStreamResourceKeySuccess(id, result))
            dispatch(getStreamResourceKeys(id))
        }, (e) => {
            const error = {
                title: 'Error!',
                message: e.message,
            }
            dispatch(addResourceKeyFailure(error))
            throw e
        })
}

export const removeStreamResourceKey = (id: StreamId, keyId: ResourceKeyId) => (dispatch: Function) => {
    dispatch(removeResourceKeyRequest())
    return services.removeStreamResourceKey(id, keyId)
        .then(() => dispatch(removeStreamResourceKeySuccess(id, keyId)))
        .catch((e) => {
            const error = {
                title: 'Error!',
                message: e.message,
            }
            dispatch(removeResourceKeyFailure(error))
            throw e
        })
}

export const editStreamResourceKey =
    (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission) => (dispatch: Function) => {
        dispatch(editStreamResourceKeyRequest())
        return services.editStreamResourceKey(streamId, keyId, keyName, keyPermission)
            .then((data) => ({
                ...data,
                type: 'STREAM',
            }))
            .then(handleEntities(resourceKeySchema, dispatch))
            .then((result) => {
                dispatch(editStreamResourceKeySuccess(keyId, result))
                dispatch(getStreamResourceKeys(streamId))
            })
            .catch((e) => {
                const error = {
                    title: 'Error!',
                    message: e.message,
                }
                dispatch(editStreamResourceKeyFailure(error))
                throw e
            })
    }
