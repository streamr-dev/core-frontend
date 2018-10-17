// @flow

import path from 'path'

import { error as errorNotification } from 'react-notification-system-redux'
import * as api from '$shared/utils/api'

import type { Key, ResourceType, ResourceId } from '../../flowtype/key-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export const GET_RESOURCE_KEYS_REQUEST = 'GET_RESOURCE_KEYS_REQUEST'
export const GET_RESOURCE_KEYS_SUCCESS = 'GET_RESOURCE_KEYS_SUCCESS'
export const GET_RESOURCE_KEYS_FAILURE = 'GET_RESOURCE_KEYS_FAILURE'

export const ADD_RESOURCE_KEY_REQUEST = 'ADD_RESOURCE_KEY_REQUEST'
export const ADD_RESOURCE_KEY_SUCCESS = 'ADD_RESOURCE_KEY_SUCCESS'
export const ADD_RESOURCE_KEY_FAILURE = 'ADD_RESOURCE_KEY_FAILURE'

export const REMOVE_RESOURCE_KEY_REQUEST = 'REMOVE_RESOURCE_KEY_REQUEST'
export const REMOVE_RESOURCE_KEY_SUCCESS = 'REMOVE_RESOURCE_KEY_SUCCESS'
export const REMOVE_RESOURCE_KEY_FAILURE = 'REMOVE_RESOURCE_KEY_FAILURE'

const getApiUrl = (resourceType: ResourceType, resourceId: ResourceId, keyId?: $ElementType<Key, 'id'>) => {
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

const getResourceKeysSuccess = (resourceType: ResourceType, resourceId: ResourceId, keys: Array<Key>) => ({
    type: GET_RESOURCE_KEYS_SUCCESS,
    resourceType,
    resourceId,
    keys,
})

const getResourceKeysFailure = (error: ErrorInUi) => ({
    type: GET_RESOURCE_KEYS_FAILURE,
    error,
})

const addResourceKeyRequest = () => ({
    type: ADD_RESOURCE_KEY_REQUEST,
})

const addResourceKeySuccess = (resourceType: ResourceType, resourceId: ResourceId, key: Key) => ({
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

const removeResourceKeySuccess = (resourceType: ResourceType, resourceId: ResourceId, keyId: $ElementType<Key, 'id'>) => ({
    type: REMOVE_RESOURCE_KEY_SUCCESS,
    resourceType,
    resourceId,
    keyId,
})

const removeResourceKeyFailure = (error: ErrorInUi) => ({
    type: REMOVE_RESOURCE_KEY_FAILURE,
    error,
})

export const getResourceKeys = (resourceType: ResourceType, resourceId: ResourceId) => (dispatch: Function) => {
    dispatch(getResourceKeysRequest())
    return api.get(getApiUrl(resourceType, resourceId))
        .then((data) => dispatch(getResourceKeysSuccess(resourceType, resourceId, data)))
        .catch((e) => {
            dispatch(getResourceKeysFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const addResourceKey = (resourceType: ResourceType, resourceId: ResourceId, key: Key) => (dispatch: Function) => {
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

export const removeResourceKey = (resourceType: ResourceType, resourceId: ResourceId, keyId: $ElementType<Key, 'id'>) => (dispatch: Function) => {
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
