// @flow

import type { UserPageStreamsState } from '$userpages/flowtype/states/stream-state'
import type { StreamAction } from '$userpages/flowtype/actions/stream-actions'
import { streamListPageSize } from '$userpages/utils/constants'

import {
    GET_STREAM_REQUEST,
    GET_STREAM_SUCCESS,
    GET_STREAM_FAILURE,
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
    CLEAR_STREAM_LIST,
    CREATE_STREAM_REQUEST,
    CREATE_STREAM_SUCCESS,
    CREATE_STREAM_FAILURE,
    UPDATE_STREAM_REQUEST,
    UPDATE_STREAM_SUCCESS,
    UPDATE_STREAM_FAILURE,
    DELETE_STREAM_REQUEST,
    DELETE_STREAM_SUCCESS,
    DELETE_STREAM_FAILURE,
    OPEN_STREAM,
    STREAM_FIELD_AUTODETECT_REQUEST,
    STREAM_FIELD_AUTODETECT_SUCCESS,
    STREAM_FIELD_AUTODETECT_FAILURE,
} from './actions'

const initialState = {
    ids: [],
    openStream: {
        id: null,
    },
    savingStreamFields: false,
    fetching: false,
    updating: false,
    deleting: false,
    error: null,
    autodetectFetching: false,
    streamFieldAutodetectError: null,
    pageSize: streamListPageSize,
    hasMoreSearchResults: null,
}

export default function (state: UserPageStreamsState = initialState, action: StreamAction): UserPageStreamsState {
    switch (action.type) {
        case GET_STREAM_REQUEST:
        case GET_STREAMS_REQUEST:
        case CREATE_STREAM_REQUEST:
        case DELETE_STREAM_REQUEST:
            return {
                ...state,
                fetching: true,
            }

        case UPDATE_STREAM_REQUEST:
            return {
                ...state,
                fetching: true,
                updating: true,
            }

        case GET_STREAM_SUCCESS:
            return {
                ...state,
                fetching: false,
                error: null,
            }
        case CREATE_STREAM_SUCCESS:
            return {
                ...state,
                fetching: false,
                error: null,
            }

        case GET_STREAMS_SUCCESS: {
            const ids = [
                ...new Set(( // ensure no duplicates in ids list
                    state.ids
                        .concat(action.streams)
                        .reverse() // reverse before new Set to remove earlier id
                )),
            ].reverse() // then re-reverse results to restore original ordering
            return {
                ...state,
                fetching: false,
                error: null,
                ids,
                hasMoreSearchResults: action.hasMoreResults,
            }
        }

        case CLEAR_STREAM_LIST:
            return {
                ...state,
                error: null,
                ids: [],
                hasMoreSearchResults: null,
            }

        case UPDATE_STREAM_SUCCESS:
            return {
                ...state,
                fetching: false,
                updating: false,
                error: null,
            }

        case DELETE_STREAM_SUCCESS: {
            const removedId = action.id // flow complains about using action.id directly ¯\_(ツ)_/¯
            const ids = state.ids.filter((id) => (id !== removedId))
            return {
                ...state,
                ids,
                fetching: false,
                error: null,
            }
        }

        case GET_STREAM_FAILURE:
        case GET_STREAMS_FAILURE:
        case CREATE_STREAM_FAILURE:
        case DELETE_STREAM_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }

        case UPDATE_STREAM_FAILURE:
            return {
                ...state,
                fetching: false,
                updating: false,
                error: action.error,
            }

        case OPEN_STREAM:
            return {
                ...state,
                openStream: {
                    ...state.openStream,
                    id: action.id,
                },
            }

        case STREAM_FIELD_AUTODETECT_REQUEST: {
            return {
                ...state,
                autodetectFetching: true,
            }
        }

        case STREAM_FIELD_AUTODETECT_SUCCESS: {
            const newState = {
                ...state,
                autodetectFetching: false,
            }

            return newState
        }

        case STREAM_FIELD_AUTODETECT_FAILURE: {
            return {
                ...state,
                autodetectFetching: false,
                streamFieldAutodetectError: action.error,
            }
        }

        default:
            return state
    }
}
