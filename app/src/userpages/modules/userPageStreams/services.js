// @flow

import { get, post, put, del } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { StreamId, Stream, StreamList, NewStream, StreamStatus } from '$shared/flowtype/stream-types'
import type { Permission } from '$userpages/flowtype/permission-types'

export const getStream = (id: StreamId): ApiResult<Stream> => get(formatApiUrl('streams', id))

export const postStream = (stream: NewStream): ApiResult<Stream> => post(formatApiUrl('streams'), stream)

export const putStream = (id: StreamId, stream: Stream): ApiResult<null> => put(formatApiUrl('streams', id), stream)

export const deleteStream = (id: StreamId): ApiResult<null> => del(formatApiUrl('streams', id))

export const getStreams = (params: any): ApiResult<StreamList> => get(formatApiUrl('streams'), { params })

export const getMyStreamPermissions = (id: StreamId): ApiResult<Array<Permission>> =>
    get(formatApiUrl('streams', id, 'permissions', 'me'))

export const getStreamStatus = (id: StreamId): ApiResult<StreamStatus> => get(formatApiUrl('streams', id, 'status'))
