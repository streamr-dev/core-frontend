// @flow

import path from 'path'
import { createAction } from 'redux-actions'

import { error as errorNotification } from 'react-notification-system-redux'
import * as api from '$shared/utils/api'
import * as services from './services'

import type { ResourceKeyId, ResourceKeyIdList, ResourceKey, ResourceType, ResourceId } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { resourceKeysSchema } from '$shared/modules/entities/schema'

import {
    GET_RESOURCE_KEYS_REQUEST,
    GET_MY_RESOURCE_KEYS_SUCCESS,
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    GET_RESOURCE_KEYS_FAILURE,
    ADD_RESOURCE_KEY_REQUEST,
    ADD_RESOURCE_KEY_SUCCESS,
    ADD_RESOURCE_KEY_FAILURE,
    REMOVE_RESOURCE_KEY_REQUEST,
    REMOVE_RESOURCE_KEY_SUCCESS,
    REMOVE_RESOURCE_KEY_FAILURE,
} from './constants'
import type { MyResourceKeysActionCreator, StreamResourceKeysActionCreator } from './types'

const getApiUrl = (resourceType: ResourceType, resourceId: ResourceId, keyId?: ResourceKeyId) => {
    const urlPart = {
        STREAM: 'streams',
        USER: 'users',
    }[resourceType]
    if (!urlPart) {
        throw new Error(`Invalid resource type: ${resourceType}`)
    }
    return `${process.env.STREAMR_API_URL}/${path.join(urlPart, resourceId, 'keys', keyId || '')}`
}

const getResourceKeysRequest = () => ({
    type: GET_RESOURCE_KEYS_REQUEST,
})

const getMyResourceKeysSuccess: MyResourceKeysActionCreator = createAction(
    GET_MY_RESOURCE_KEYS_SUCCESS,
    (keys: ResourceKeyIdList) => ({
        keys,
    }),
)

const getStreamResourceKeysSuccess: StreamResourceKeysActionCreator = createAction(
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    (id: StreamId, keys: ResourceKeyIdList) => ({
        id,
        keys,
    }),
)

const getResourceKeysFailure = (error: ErrorInUi) => ({
    type: GET_RESOURCE_KEYS_FAILURE,
    error,
})

const addResourceKeyRequest = () => ({
    type: ADD_RESOURCE_KEY_REQUEST,
})

const addResourceKeySuccess = (resourceType: ResourceType, resourceId: ResourceId, key: ResourceKey) => ({
    type: ADD_RESOURCE_KEY_SUCCESS,
    resourceType,
    resourceId,
    key,
})

const addResourceKeyFailure = (error: ErrorInUi) => ({
    type: ADD_RESOURCE_KEY_FAILURE,
    error,
})

const removeResourceKeyRequest = () => ({
    type: REMOVE_RESOURCE_KEY_REQUEST,
})

const removeResourceKeySuccess = (resourceType: ResourceType, resourceId: ResourceId, keyId: ResourceKeyId) => ({
    type: REMOVE_RESOURCE_KEY_SUCCESS,
    resourceType,
    resourceId,
    keyId,
})

const removeResourceKeyFailure = (error: ErrorInUi) => ({
    type: REMOVE_RESOURCE_KEY_FAILURE,
    error,
})

export const getMyResourceKeys = () => (dispatch: Function) => {
    dispatch(getResourceKeysRequest())
    return services.getMyResourceKeys()
        .then(handleEntities(resourceKeysSchema, dispatch))
        .then((result) => dispatch(getMyResourceKeysSuccess(result)))
        .catch((e) => {
            dispatch(getResourceKeysFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const getStreamResourceKeys = (id: StreamId) => (dispatch: Function) => {
    dispatch(getResourceKeysRequest())
    return services.getStreamResourceKeys(id)
        .then(handleEntities(resourceKeysSchema, dispatch))
        .then((result) => dispatch(getStreamResourceKeysSuccess(id, result)))
        .catch((e) => {
            dispatch(getResourceKeysFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const addResourceKey = (resourceType: ResourceType, resourceId: ResourceId, key: ResourceKey) => (dispatch: Function) => {
    dispatch(addResourceKeyRequest())
    return api.post(getApiUrl(resourceType, resourceId), key)
        .then((data) => dispatch(addResourceKeySuccess(resourceType, resourceId, data)))
        .catch((e) => {
            dispatch(addResourceKeyFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const removeResourceKey = (resourceType: ResourceType, resourceId: ResourceId, keyId: ResourceKeyId) => (dispatch: Function) => {
    dispatch(removeResourceKeyRequest())
    return api.del(getApiUrl(resourceType, resourceId, keyId))
        .then(() => dispatch(removeResourceKeySuccess(resourceType, resourceId, keyId)))
        .catch((e) => {
            dispatch(removeResourceKeyFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}
