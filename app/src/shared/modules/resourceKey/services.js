// @flow

import { get, post, del, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ResourceKeyList, ResourceKey, ResourceKeyId, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

export const getMyResourceKeys = (): ApiResult<ResourceKeyList> =>
    get(formatApiUrl('users', 'me', 'keys'))

export const getStreamResourceKeys = (streamId: StreamId): ApiResult<ResourceKeyList> =>
    get(formatApiUrl('streams', streamId, 'keys'))

export const addMyResourceKey = (keyName: string): ApiResult<ResourceKey> =>
    post(formatApiUrl('users', 'me', 'keys'), {
        name: keyName,
    })

export const addStreamResourceKey = (streamId: StreamId, name: string, permission: ResourcePermission): ApiResult<ResourceKey> =>
    post(formatApiUrl('streams', streamId, 'keys'), {
        name,
        permission,
    })

export const editStreamResourceKey =
    (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission): ApiResult<ResourceKey> =>
        put(formatApiUrl('streams', streamId, 'keys', keyId), {
            name: keyName,
            permission: keyPermission,
        })

export const editMyResourceKey = (keyId: ResourceKeyId, name: string): ApiResult<ResourceKey> =>
    put(formatApiUrl('users', 'me', 'keys', keyId), {
        name,
    })

export const removeMyResourceKey = (id: ResourceKeyId): ApiResult<null> =>
    del(formatApiUrl('users', 'me', 'keys', id))

export const removeStreamResourceKey = (streamId: StreamId, id: ResourceKeyId): ApiResult<null> =>
    del(formatApiUrl('streams', streamId, 'keys', id))
