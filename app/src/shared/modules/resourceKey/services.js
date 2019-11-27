// @flow

import { get, post, del, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ResourceKeyList, ResourceKey, ResourceKeyId, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

export const getMyResourceKeys = (): ApiResult<ResourceKeyList> => get({
    url: formatApiUrl('users', 'me', 'keys'),
})

export const getStreamResourceKeys = (streamId: StreamId): ApiResult<ResourceKeyList> => get({
    url: formatApiUrl('streams', streamId, 'keys'),
})

export const addMyResourceKey = (keyName: string): ApiResult<ResourceKey> => post({
    url: formatApiUrl('users', 'me', 'keys'),
    data: {
        name: keyName,
    },
})

export const addStreamResourceKey = (streamId: StreamId, name: string, permission: ResourcePermission): ApiResult<ResourceKey> =>
    post({
        url: formatApiUrl('streams', streamId, 'keys'),
        data: {
            name,
            permission,
        },
    })

export const editStreamResourceKey =
    (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission): ApiResult<ResourceKey> =>
        put({
            url: formatApiUrl('streams', streamId, 'keys', keyId),
            data: {
                name: keyName,
                permission: keyPermission,
            },
        })

export const editMyResourceKey = (keyId: ResourceKeyId, name: string): ApiResult<ResourceKey> =>
    put({
        url: formatApiUrl('users', 'me', 'keys', keyId),
        data: {
            name,
        },
    })

export const removeMyResourceKey = (id: ResourceKeyId): ApiResult<null> => del({
    url: formatApiUrl('users', 'me', 'keys', id),
})

export const removeStreamResourceKey = (streamId: StreamId, id: ResourceKeyId): ApiResult<null> => del({
    url: formatApiUrl('streams', streamId, 'keys', id),
})
