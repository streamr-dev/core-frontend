// @flow

import { get, post, del } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ResourceKeyList, ResourceKey, ResourceKeyId, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'

export const getMyResourceKeys = (): ApiResult<ResourceKeyList> =>
    get(formatApiUrl('users', 'me', 'keys'))

export const getStreamResourceKeys = (id: StreamId): ApiResult<ResourceKeyList> =>
    get(formatApiUrl('streams', id, 'keys'))

export const addMyResourceKey = (name: string): ApiResult<ResourceKey> =>
    post(formatApiUrl('users', 'me', 'keys'), {
        name,
    })

export const addStreamResourceKey = (streamId: StreamId, name: string, permission: ResourcePermission): ApiResult<ResourceKey> =>
    post(formatApiUrl('streams', streamId, 'keys'), {
        name,
        permission,
    })

export const removeMyResourceKey = (id: ResourceKeyId): ApiResult<null> =>
    del(formatApiUrl('users', 'me', 'keys', id))

export const removeStreamResourceKey = (streamId: StreamId, id: ResourceKeyId): ApiResult<null> =>
    del(formatApiUrl('streams', streamId, 'keys', id))
