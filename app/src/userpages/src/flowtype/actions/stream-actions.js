// @flow

import type { Stream } from '../stream-types'
import type { Permission } from '../permission-types'
import type { ErrorInUi } from '../common-types'

import {
    GET_STREAM_REQUEST,
    GET_STREAM_SUCCESS,
    GET_STREAM_FAILURE,
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
    GET_MY_STREAM_PERMISSIONS_REQUEST,
    GET_MY_STREAM_PERMISSIONS_SUCCESS,
    GET_MY_STREAM_PERMISSIONS_FAILURE,
    OPEN_STREAM,
} from '../../modules/stream/actions'

export type StreamAction = {
    type: typeof GET_STREAM_REQUEST
        | typeof GET_STREAMS_REQUEST
        | typeof GET_MY_STREAM_PERMISSIONS_REQUEST,
} | {
    type: typeof OPEN_STREAM,
    id: $ElementType<Stream, 'id'>
} | {
    type: typeof GET_STREAM_SUCCESS,
    stream: Stream
} | {
    type: typeof GET_STREAMS_SUCCESS,
    streams: Array<Stream>
} | {
    type: typeof GET_MY_STREAM_PERMISSIONS_SUCCESS,
    id: $ElementType<Stream, 'id'>,
    permissions: Array<$ElementType<Permission, 'operation'>>
} | {
    type: typeof GET_STREAM_FAILURE
        | typeof GET_MY_STREAM_PERMISSIONS_FAILURE
        | typeof GET_STREAMS_FAILURE,
    error: ErrorInUi
}
