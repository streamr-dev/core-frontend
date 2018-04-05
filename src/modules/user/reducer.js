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
    loginKey: null,
    integrationKeys: null,
    fetchingLogin: false,
    loginError: null,
}

const reducer: (UserState) => UserState = handleActions({
    [LOGIN_REQUEST]: (state: UserState): UserState => ({
        ...state,
        fetchingLogin: true,
    }),

    [LOGIN_SUCCESS]: (state: UserState, action: UserTokenAction) => ({
        ...state,
        loginKey: action.payload.loginKey,
        fetchingLogin: false,
        loginError: null,
    }),

    [LOGIN_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingLogin: false,
        loginError: action.payload.error,
    }),

    [LOGOUT]: (state: UserState) => ({
        ...state,
        loginKey: null,
        integrationKeys: null,
        loginError: null,
    }),

}, initialState)

export default reducer
