// @flow

import { get, post, del, put } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ResourceKeyList, ResourceKey, ResourceKeyId, ResourcePermission } from '$shared/flowtype/resource-key-types'
import type { StreamId } from '$shared/flowtype/stream-types'
import routes from '$routes'

export const getMyResourceKeys = (): ApiResult<ResourceKeyList> => get({
    url: routes.api.me.keys.index(),
})

export const getStreamResourceKeys = (streamId: StreamId): ApiResult<ResourceKeyList> => get({
    url: routes.api.streams.keys.index({
        streamId,
    }),
})

export const addMyResourceKey = (keyName: string): ApiResult<ResourceKey> => post({
    url: routes.api.me.keys.index(),
    data: {
        name: keyName,
    },
})

export const addStreamResourceKey = (streamId: StreamId, name: string, permission: ResourcePermission): ApiResult<ResourceKey> =>
    post({
        url: routes.api.streams.keys.index({
            streamId,
        }),
        data: {
            name,
            permission,
        },
    })

export const editStreamResourceKey =
    (streamId: StreamId, id: ResourceKeyId, keyName: string, keyPermission: ResourcePermission): ApiResult<ResourceKey> =>
        put({
            url: routes.api.streams.keys.show({
                streamId,
                id,
            }),
            data: {
                name: keyName,
                permission: keyPermission,
            },
        })

export const editMyResourceKey = (id: ResourceKeyId, name: string): ApiResult<ResourceKey> =>
    put({
        url: routes.api.me.keys.show({
            id,
        }),
        data: {
            name,
        },
    })

export const removeMyResourceKey = (id: ResourceKeyId): ApiResult<null> => del({
    url: routes.api.me.keys.show({
        id,
    }),
})

export const removeStreamResourceKey = (streamId: StreamId, id: ResourceKeyId): ApiResult<null> => del({
    url: routes.api.streams.keys.show({
        streamId,
        id,
    }),
})
