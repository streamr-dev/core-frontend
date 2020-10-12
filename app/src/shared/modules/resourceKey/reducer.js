// @flow

import { handleActions } from 'redux-actions'

import type { ResourceKeyState } from '$shared/flowtype/store-state'

import {
    GET_RESOURCE_KEYS_REQUEST,
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    GET_RESOURCE_KEYS_FAILURE,
    ADD_RESOURCE_KEY_REQUEST,
    ADD_RESOURCE_KEY_FAILURE,
    ADD_STREAM_RESOURCE_KEY_SUCCESS,
    REMOVE_RESOURCE_KEY_REQUEST,
    REMOVE_STREAM_RESOURCE_KEY_SUCCESS,
    REMOVE_RESOURCE_KEY_FAILURE,
} from './constants'
import type {
    StreamResourceKeysAction,
    StreamResourceKeyAction,
    ResourceKeysErrorAction,
} from './types'

export const initialState: ResourceKeyState = {
    users: {},
    streams: {},
    error: null,
    fetching: false,
}

const reducer: (ResourceKeyState) => ResourceKeyState = handleActions({
    [GET_RESOURCE_KEYS_REQUEST]: (state: ResourceKeyState) => ({
        ...state,
        fetching: true,
    }),

    [GET_STREAM_RESOURCE_KEYS_SUCCESS]: (state: ResourceKeyState, action: StreamResourceKeysAction) => ({
        ...state,
        streams: {
            ...state.streams,
            [action.payload.id]: action.payload.keys,
        },
        fetching: false,
        error: null,
    }),

    [GET_RESOURCE_KEYS_FAILURE]: (state: ResourceKeyState, action: ResourceKeysErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [ADD_RESOURCE_KEY_REQUEST]: (state: ResourceKeyState) => ({
        ...state,
        fetching: true,
    }),

    [ADD_STREAM_RESOURCE_KEY_SUCCESS]: (state: ResourceKeyState, action: StreamResourceKeyAction) => ({
        ...state,
        streams: {
            ...state.streams,
            [action.payload.id]: [...(state.streams[action.payload.id] || []), action.payload.key],
        },
        fetching: false,
        error: null,
    }),

    [ADD_RESOURCE_KEY_FAILURE]: (state: ResourceKeyState, action: ResourceKeysErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [REMOVE_RESOURCE_KEY_REQUEST]: (state: ResourceKeyState) => ({
        ...state,
        fetching: true,
    }),

    [REMOVE_STREAM_RESOURCE_KEY_SUCCESS]: (state: ResourceKeyState, action: StreamResourceKeyAction) => ({
        ...state,
        streams: {
            ...state.streams,
            [action.payload.id]: (state.streams[action.payload.id] || []).filter((id) => id !== action.payload.key),
        },
        fetching: false,
        error: null,
    }),

    [REMOVE_RESOURCE_KEY_FAILURE]: (state: ResourceKeyState, action: ResourceKeysErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

}, initialState)

export default reducer
