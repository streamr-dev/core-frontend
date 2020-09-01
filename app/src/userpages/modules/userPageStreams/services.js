// @flow

import { get, post, put, del } from '$shared/utils/api'
import routes from '$routes'
import type { ApiResult } from '$shared/flowtype/common-types'
import type {
    StreamId,
    Stream,
    StreamList,
    NewStream,
    StreamStatus,
} from '$shared/flowtype/stream-types'

export const getStream = (id: StreamId): ApiResult<Stream> => get({
    url: routes.api.streams.show({
        id,
    }),
})

export const postStream = (stream: NewStream): ApiResult<Stream> => post({
    url: routes.api.streams.index(),
    data: stream,
})

export const putStream = (id: StreamId, stream: Stream): ApiResult<null> => put({
    url: routes.api.streams.show({
        id,
    }),
    data: stream,
})

export const deleteStream = (id: StreamId): ApiResult<null> => del({
    url: routes.api.streams.show({
        id,
    }),
})

export type StreamListWrapper = {
    streams: StreamList,
    hasMoreResults: boolean,
}

export const getStreams = (params: any, pageSize: number, offset: number): ApiResult<StreamListWrapper> => get({
    url: routes.api.streams.index({
        ...params,
        max: pageSize + 1, // query 1 extra element to determine if we should show "load more" button
        offset,
    }),
})
    .then((streams) => ({
        streams: streams.splice(0, pageSize),
        hasMoreResults: streams.length > 0,
    }))

export const getStreamStatus = (streamId: StreamId): ApiResult<StreamStatus> => get({
    url: routes.api.streams.status({
        streamId,
    }),
})

export const autodetectStreamfields = (streamId: StreamId): ApiResult<Stream> => get({
    url: routes.api.streams.detectFields({
        streamId,
    }),
})
