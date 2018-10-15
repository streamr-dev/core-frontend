// @flow

import type { UserPageStreamsState } from '../../flowtype/states/stream-state'
import type { StreamAction } from '../../flowtype/actions/stream-actions'

import {
    GET_STREAM_REQUEST,
    GET_STREAM_SUCCESS,
    GET_STREAM_FAILURE,
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
    CREATE_STREAM_REQUEST,
    CREATE_STREAM_SUCCESS,
    CREATE_STREAM_FAILURE,
    UPDATE_STREAM_REQUEST,
    UPDATE_STREAM_SUCCESS,
    UPDATE_STREAM_FAILURE,
    DELETE_STREAM_REQUEST,
    DELETE_STREAM_SUCCESS,
    DELETE_STREAM_FAILURE,
    SAVE_STREAM_FIELDS_REQUEST,
    SAVE_STREAM_FIELDS_SUCCESS,
    SAVE_STREAM_FIELDS_FAILURE,
    GET_MY_STREAM_PERMISSIONS_REQUEST,
    GET_MY_STREAM_PERMISSIONS_SUCCESS,
    GET_MY_STREAM_PERMISSIONS_FAILURE,
    UPLOAD_CSV_FILE_REQUEST,
    UPLOAD_CSV_FILE_SUCCESS,
    UPLOAD_CSV_FILE_FAILURE,
    UPLOAD_CSV_FILE_UNKNOWN_SCHEMA,
    CONFIRM_CSV_FILE_UPLOAD_REQUEST,
    CONFIRM_CSV_FILE_UPLOAD_SUCCESS,
    CONFIRM_CSV_FILE_UPLOAD_FAILURE,
    OPEN_STREAM,
    CANCEL_CSV_FILE_UPLOAD,
} from './actions'

const initialState = {
    ids: [],
    openStream: {
        id: null,
    },
    savingStreamFields: false,
    fetching: false,
    error: null,
    csvUpload: null,
}

export default function (state: UserPageStreamsState = initialState, action: StreamAction): UserPageStreamsState {
    switch (action.type) {
        case GET_STREAM_REQUEST:
        case GET_STREAMS_REQUEST:
        case CREATE_STREAM_REQUEST:
        case UPDATE_STREAM_REQUEST:
        case GET_MY_STREAM_PERMISSIONS_REQUEST:
        case DELETE_STREAM_REQUEST:
            return {
                ...state,
                fetching: true,
            }

        case SAVE_STREAM_FIELDS_REQUEST:
            return {
                ...state,
                fetching: true,
                savingStreamFields: true,
            }

        case UPLOAD_CSV_FILE_REQUEST:
            return {
                ...state,
                csvUpload: {
                    id: action.id,
                    fetching: true,
                },
            }

        case CONFIRM_CSV_FILE_UPLOAD_REQUEST:
            return {
                ...state,
                csvUpload: {
                    ...(state.csvUpload || {}),
                    fetching: true,
                },
            }

        case UPLOAD_CSV_FILE_SUCCESS:
        case CONFIRM_CSV_FILE_UPLOAD_SUCCESS:
            return {
                ...state,
                fetching: false,
                csvUpload: null,
            }

        case GET_STREAM_SUCCESS:
        case CREATE_STREAM_SUCCESS:
            return {
                ...state,
                fetching: false,
                error: null,
            }

        case GET_STREAMS_SUCCESS:
            return {
                ...state,
                ids: action.streams,
                fetching: false,
                error: null,
            }

        case UPDATE_STREAM_SUCCESS:
            return {
                ...state,
                fetching: false,
                error: null,
            }

        case DELETE_STREAM_SUCCESS: {
            const removedId = action.id // flow complains about using action.id directly ¯\_(ツ)_/¯
            return {
                ...state,
                ids: state.ids.filter((id) => (id !== removedId)),
                fetching: false,
                error: null,
            }
        }

        case GET_MY_STREAM_PERMISSIONS_SUCCESS:
            return {
                ...state,
                error: null,
                fetching: false,
            }

        case UPLOAD_CSV_FILE_UNKNOWN_SCHEMA:
            return {
                ...state,
                csvUpload: {
                    fetching: false,
                    id: action.streamId,
                    fileUrl: action.fileUrl,
                    schema: action.schema,
                },
            }

        case UPLOAD_CSV_FILE_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
                csvUpload: null,
            }

        case CONFIRM_CSV_FILE_UPLOAD_FAILURE:
            return {
                ...state,
                error: action.error,
                csvUpload: {
                    ...(state.csvUpload || {}),
                    fetching: false,
                },
            }

        case GET_STREAM_FAILURE:
        case GET_STREAMS_FAILURE:
        case CREATE_STREAM_FAILURE:
        case UPDATE_STREAM_FAILURE:
        case GET_MY_STREAM_PERMISSIONS_FAILURE:
        case DELETE_STREAM_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
            }

        case SAVE_STREAM_FIELDS_FAILURE:
            return {
                ...state,
                savingStreamFields: false,
                fetching: false,
                error: action.error,
            }

        case SAVE_STREAM_FIELDS_SUCCESS: {
            return {
                ...state,
                fetching: false,
                error: null,
            }
        }

        case OPEN_STREAM:
            return {
                ...state,
                openStream: {
                    ...state.openStream,
                    id: action.id,
                },
            }

        case CANCEL_CSV_FILE_UPLOAD:
            return {
                ...state,
                csvUpload: null,
                fetching: false,
            }

        default:
            return state
    }
}
