// @flow

import moment from 'moment-timezone'

import { get, post, put, del } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type {
    StreamId,
    Stream,
    StreamList,
    NewStream,
    StreamStatus,
    CsvUploadResult,
    Range,
} from '$shared/flowtype/stream-types'
import type { Permission } from '$userpages/flowtype/permission-types'

export const getStream = (id: StreamId): ApiResult<Stream> => get({
    url: formatApiUrl('streams', id),
})

export const postStream = (stream: NewStream): ApiResult<Stream> => post({
    url: formatApiUrl('streams'),
    data: stream,
})

export const putStream = (id: StreamId, stream: Stream): ApiResult<null> => put({
    url: formatApiUrl('streams', id),
    data: stream,
})

export const deleteStream = (id: StreamId): ApiResult<null> => del({
    url: formatApiUrl('streams', id),
})

export type StreamListWrapper = {
    streams: StreamList,
    hasMoreResults: boolean,
}

export const getStreams = (params: any, pageSize: number, offset: number): ApiResult<StreamListWrapper> => get({
    url: formatApiUrl('streams', {
        ...params,
        max: pageSize + 1, // query 1 extra element to determine if we should show "load more" button
        offset,
    }),
})
    .then((streams) => ({
        streams: streams.splice(0, pageSize),
        hasMoreResults: streams.length > 0,
    }))

export const getMyStreamPermissions = (id: StreamId): ApiResult<Array<Permission>> => get({
    url: formatApiUrl('streams', id, 'permissions', 'me'),
})

export const getStreamStatus = (id: StreamId): ApiResult<StreamStatus> => get({
    url: formatApiUrl('streams', id, 'status'),
})

export const uploadCsvFile = (id: StreamId, file: File): Promise<CsvUploadResult> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const formData = new FormData()
    formData.append('file', file)

    return post({
        url: formatApiUrl('streams', id, 'uploadCsvFile'),
        data: formData,
        options,
    })
}

export const confirmCsvFileUpload = (
    id: StreamId,
    fileId: string,
    dateFormat: string,
    timestampColumnIndex: number,
): ApiResult<any> => post({
    url: formatApiUrl('streams', id, 'confirmCsvFileUpload'),
    data: {
        fileId,
        dateFormat,
        timestampColumnIndex,
    },
})

export const getRange = (id: StreamId): ApiResult<Range> => get({
    url: formatApiUrl('streams', id, 'range'),
})

export const deleteDataUpTo = (id: StreamId, date: Date): ApiResult<any> => del({
    url: formatApiUrl('streams', id, 'deleteDataUpTo'),
    data: {
        id,
        date: moment(date).valueOf(),
    },
})

export const autodetectStreamfields = (id: StreamId): ApiResult<Stream> => get({
    url: formatApiUrl('streams', id, 'detectFields'),
})
