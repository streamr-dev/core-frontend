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

export const getStream = (id: StreamId): ApiResult<Stream> => get(formatApiUrl('streams', id))

export const postStream = (stream: NewStream): ApiResult<Stream> => post(formatApiUrl('streams'), stream)

export const putStream = (id: StreamId, stream: Stream): ApiResult<null> => put(formatApiUrl('streams', id), stream)

export const deleteStream = (id: StreamId): ApiResult<null> => del(formatApiUrl('streams', id))

export const getStreams = (params: any): ApiResult<StreamList> => get(formatApiUrl('streams'), { params })

export const getMyStreamPermissions = (id: StreamId): ApiResult<Array<Permission>> =>
    get(formatApiUrl('streams', id, 'permissions', 'me'))

export const getStreamStatus = (id: StreamId): ApiResult<StreamStatus> => get(formatApiUrl('streams', id, 'status'))

export const uploadCsvFile = (id: StreamId, file: File): Promise<CsvUploadResult> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const formData = new FormData()
    formData.append('file', file)

    return post(formatApiUrl('streams', id, 'uploadCsvFile'), formData, options)
}

export const confirmCsvFileUpload = (
    id: StreamId,
    fileId: string,
    dateFormat: string,
    timestampColumnIndex: number,
): ApiResult<any> => (
    post(formatApiUrl('streams', id, 'confirmCsvFileUpload'), {
        fileId,
        dateFormat,
        timestampColumnIndex,
    })
)

export const getRange = (id: StreamId): ApiResult<Range> => get(formatApiUrl('streams', id, 'range'))

export const deleteDataUpTo = (id: StreamId, date: Date): ApiResult<any> => (
    del(formatApiUrl('stream', id, 'deleteDataUpTo'), {
        id,
        date: moment(date).valueOf(),
    })
)

export const autodetectStreamfields = (id: StreamId): ApiResult<Stream> => get(formatApiUrl('streams', id, 'detectFields'))
