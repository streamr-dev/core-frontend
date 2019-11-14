// @flow

import { handleActions } from 'redux-actions'

import type { CommunityProductState } from '../../flowtype/store-state'

import {
    GET_COMMUNITY_REQUEST,
    GET_COMMUNITY_SUCCESS,
    GET_COMMUNITY_FAILURE,
} from './constants'
import type {
    CommunityIdAction,
    CommunityErrorAction,
} from './types'

export const initialState: CommunityProductState = {
    id: null,
    fetching: false,
    error: null,
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
}, initialState)

export default reducer
