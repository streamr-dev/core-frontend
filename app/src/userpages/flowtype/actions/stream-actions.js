// @flow

import type { Stream, StreamId, StreamIdList } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import {
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
    DELETE_STREAM_SUCCESS,
    CREATE_STREAM_FAILURE,
    DELETE_STREAM_FAILURE,
} from '$userpages/modules/userPageStreams/actions'

export type StreamAction = {
    type: typeof GET_STREAMS_REQUEST,
} | {
    type: typeof DELETE_STREAM_SUCCESS,
    id: StreamId,
} | {
    type: typeof GET_STREAMS_SUCCESS,
    streams: StreamIdList,
    hasMoreResults: boolean,
} | {
    type: typeof GET_STREAMS_FAILURE
        | typeof CREATE_STREAM_FAILURE
        | typeof DELETE_STREAM_FAILURE,
    error: ErrorInUi,
}
