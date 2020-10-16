// @flow

import { handleActions } from 'redux-actions'

import type { ResourceKeyState } from '$shared/flowtype/store-state'

import {
    GET_RESOURCE_KEYS_REQUEST,
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    GET_RESOURCE_KEYS_FAILURE,
} from './constants'
import type {
    StreamResourceKeysAction,
    ResourceKeysErrorAction,
} from './types'

export const initialState: ResourceKeyState = {
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

}, initialState)

export default reducer
