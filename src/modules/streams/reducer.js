// @flow

import { handleActions } from 'redux-actions'

import {
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
} from './constants'
import type {StreamsState} from '../../flowtype/store-state'
import type {StreamIdsByProductIdAction} from './types'
import type {ProductErrorAction} from '../product/types'

const initialState: StreamsState = {
    ids: [],
    fetching: false,
    error: null
}

const reducer: (StreamsState) => StreamsState = handleActions({
    [GET_STREAMS_BY_PRODUCT_ID_REQUEST]: (state: StreamsState) => ({
        ...state,
        ids: [],
        fetching: true,
        error: null,
    }),

    [GET_STREAMS_BY_PRODUCT_ID_SUCCESS]: (state: StreamsState, action: StreamIdsByProductIdAction) => ({
        ...state,
        ids: action.payload.streams,
        fetching: false,
    }),

    [GET_STREAMS_BY_PRODUCT_ID_FAILURE]: (state: StreamsState, action: ProductErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

}, initialState)

export default reducer
