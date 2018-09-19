// @flow

import { handleActions } from 'redux-actions'

import type { StreamsState } from '../../flowtype/store-state'

import {
    GET_STREAMS_REQUEST,
    GET_STREAMS_SUCCESS,
    GET_STREAMS_FAILURE,
} from './constants'
import type {
    StreamsAction,
    StreamsErrorAction,
} from './types'

export const initialState: StreamsState = {
    ids: [],
    fetching: false,
    error: null,
}

const reducer: (StreamsState) => StreamsState = handleActions({
    [GET_STREAMS_REQUEST]: (state: StreamsState): StreamsState => ({
        ...state,
        fetching: true,
    }),

    [GET_STREAMS_SUCCESS]: (state: StreamsState, action: StreamsAction) => ({
        ids: action.payload.streams,
        fetching: false,
        error: null,
    }),

    [GET_STREAMS_FAILURE]: (state: StreamsState, action: StreamsErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),
}, initialState)

export default reducer
