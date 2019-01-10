// @flow

import type { ResourceKeyId, ResourceKeyIdList, ResourceKey, ResourceType, ResourceId } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

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
} from '$shared/modules/resourceKey/constants'

export type KeyAction = {
    type: typeof GET_RESOURCE_KEYS_REQUEST
        | typeof ADD_RESOURCE_KEY_REQUEST
        | typeof REMOVE_RESOURCE_KEY_REQUEST
} | {
    type: typeof GET_MY_RESOURCE_KEYS_SUCCESS,
    keys: ResourceKeyIdList
} | {
    type: typeof GET_STREAM_RESOURCE_KEYS_SUCCESS,
    id: StreamId,
    keys: ResourceKeyIdList
} | {
    type: typeof ADD_RESOURCE_KEY_SUCCESS,
    resourceType: ResourceType,
    resourceId: ResourceId,
    key: ResourceKey
} | {
    type: typeof REMOVE_RESOURCE_KEY_SUCCESS,
    resourceType: ResourceType,
    resourceId: ResourceId,
    keyId: ResourceKeyId
} | {
    type: typeof GET_RESOURCE_KEYS_FAILURE
        | typeof ADD_RESOURCE_KEY_FAILURE
        | typeof REMOVE_RESOURCE_KEY_FAILURE,
    error: ErrorInUi
}
