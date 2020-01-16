// @flow

import { handleActions } from 'redux-actions'

import type { CommunityProductState } from '../../flowtype/store-state'

import {
    GET_COMMUNITY_REQUEST,
    GET_COMMUNITY_SUCCESS,
    GET_COMMUNITY_FAILURE,
    GET_ALL_COMMUNITY_STATS_REQUEST,
    GET_ALL_COMMUNITY_STATS_SUCCESS,
    GET_ALL_COMMUNITY_STATS_FAILURE,
} from './constants'
import type {
    CommunityIdAction,
    CommunityErrorAction,
    CommunityIdsAction,
    CommunityStatsErrorAction,
} from './types'

export const initialState: CommunityProductState = {
    id: null,
    fetching: false,
    error: null,
    fetchingStats: false,
    ids: [],
    statsError: null,
}

const reducer: (CommunityProductState) => CommunityProductState = handleActions({
    [GET_COMMUNITY_REQUEST]: (state: CommunityProductState, action: CommunityIdAction) => ({
        ...state,
        id: action.payload.id,
        fetching: true,
        error: null,
    }),

    [GET_COMMUNITY_SUCCESS]: (state: CommunityProductState) => ({
        ...state,
        fetching: false,
    }),

    [GET_COMMUNITY_FAILURE]: (state: CommunityProductState, action: CommunityErrorAction) => ({
        ...state,
        error: action.payload.error,
        fetching: false,
    }),

    [GET_ALL_COMMUNITY_STATS_REQUEST]: (state: CommunityProductState) => ({
        ...state,
        fetchingStats: true,
        statsError: null,
    }),

    [GET_ALL_COMMUNITY_STATS_SUCCESS]: (state: CommunityProductState, action: CommunityIdsAction) => ({
        ...state,
        fetchingStats: false,
        ids: action.payload.ids,
    }),

    [GET_ALL_COMMUNITY_STATS_FAILURE]: (state: CommunityProductState, action: CommunityStatsErrorAction) => ({
        ...state,
        fetchingStats: false,
        statsError: action.payload.error,
    }),

}, initialState)

export default reducer
