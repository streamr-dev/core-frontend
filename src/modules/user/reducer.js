// @flow

import { handleActions } from 'redux-actions'

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
} from './constants'
import type { UserState } from '../../flowtype/store-state'
import type {
    UserTokenAction,
    UserErrorAction,
} from './types'

const initialState: UserState = {
    token: null,
    fetchingToken: false,
    tokenError: null
}

const reducer: (UserState) => UserState = handleActions({
    [LOGIN_REQUEST]: (state: UserState): UserState => ({
        ...state,
        fetchingToken: true
    }),

    [LOGIN_SUCCESS]: (state: UserState, action: UserTokenAction) => ({
        ...state,
        token: action.payload.user,
        fetchingToken: false,
        tokenError: null,
    }),

    [LOGIN_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingToken: false,
        tokenError: action.payload.error,
    }),

    [LOGOUT]: (state: UserState) => ({
        ...state,
        token: null,
    }),

}, initialState)

export default reducer
