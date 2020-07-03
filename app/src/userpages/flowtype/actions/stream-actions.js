// @flow

import type { Stream, StreamId, StreamIdList, CSVImporterSchema } from '$shared/flowtype/stream-types'
import type { Permission } from '../permission-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import {
    GET_STREAM_REQUEST,
    GET_STREAM_SUCCESS,
    GET_STREAM_FAILURE,
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
    OPEN_STREAM,
    UPLOAD_CSV_FILE_UNKNOWN_SCHEMA,
    CONFIRM_CSV_FILE_UPLOAD_FAILURE,
    UPLOAD_CSV_FILE_FAILURE,
    DELETE_STREAM_SUCCESS,
    SAVE_STREAM_FIELDS_SUCCESS,
    SAVE_STREAM_FIELDS_FAILURE,
    CREATE_STREAM_FAILURE,
    UPDATE_STREAM_FAILURE,
    DELETE_STREAM_FAILURE,
    UPLOAD_CSV_FILE_REQUEST,
} from '$userpages/modules/userPageStreams/actions'

export type StreamAction = {
    type: typeof GET_STREAM_REQUEST
        | typeof GET_STREAMS_REQUEST,
} | {
    type: typeof OPEN_STREAM
        | typeof UPLOAD_CSV_FILE_REQUEST
        | typeof SAVE_STREAM_FIELDS_SUCCESS
        | typeof DELETE_STREAM_SUCCESS,
    id: StreamId,
} | {
    type: typeof GET_STREAM_SUCCESS,
    stream: Stream,
} | {
    type: typeof GET_STREAMS_SUCCESS,
    streams: StreamIdList,
    hasMoreResults: boolean,
} | {
    type: typeof GET_STREAM_FAILURE
        | typeof GET_STREAMS_FAILURE
        | typeof UPLOAD_CSV_FILE_FAILURE
        | typeof CONFIRM_CSV_FILE_UPLOAD_FAILURE
        | typeof SAVE_STREAM_FIELDS_FAILURE
        | typeof CREATE_STREAM_FAILURE
        | typeof UPDATE_STREAM_FAILURE
        | typeof DELETE_STREAM_FAILURE,
    error: ErrorInUi,
} | {
    type: typeof UPLOAD_CSV_FILE_UNKNOWN_SCHEMA,
    streamId: StreamId,
    fetching: boolean,
    fileUrl?: string,
    schema?: CSVImporterSchema,
}
