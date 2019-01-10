// @flow

import { handleActions } from 'redux-actions'

import type { ResourceKeyState } from '$shared/flowtype/store-state'

import {
    GET_RESOURCE_KEYS_REQUEST,
    GET_MY_RESOURCE_KEYS_SUCCESS,
    GET_STREAM_RESOURCE_KEYS_SUCCESS,
    ADD_RESOURCE_KEY_REQUEST,
    REMOVE_RESOURCE_KEY_REQUEST,
} from './constants'
import type { MyResourceKeysAction, StreamResourceKeysAction } from './types'

const initialState: ResourceKeyState = {
    users: {},
    streams: {},
    byTypeAndId: {},
    error: null,
    fetching: false,
}

const reducer: (ResourceKeyState) => ResourceKeyState = handleActions({
    [GET_RESOURCE_KEYS_REQUEST]: (state: ResourceKeyState) => ({
        ...state,
        fetching: true,
    }),

    [ADD_RESOURCE_KEY_REQUEST]: (state: ResourceKeyState) => ({
        ...state,
        fetching: true,
    }),

    [REMOVE_RESOURCE_KEY_REQUEST]: (state: ResourceKeyState) => ({
        ...state,
        fetching: true,
    }),

    [GET_MY_RESOURCE_KEYS_SUCCESS]: (state: ResourceKeyState, action: MyResourceKeysAction) => ({
        ...state,
        users: {
            ...state.users,
            me: action.payload.keys,
        },
        fetching: false,
        error: null,
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

}, initialState)

export default reducer
