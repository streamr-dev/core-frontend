// @flow

import { createAction } from 'redux-actions'

import type { ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { UserTokenActionCreator, UserErrorActionCreator } from './types'
import type { UserToken } from '../../flowtype/user-types'

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
} from './constants'

export const loginRequest: ReduxActionCreator = createAction(LOGIN_REQUEST)

export const loginSuccess: UserTokenActionCreator = createAction(LOGIN_SUCCESS, (user: UserToken) => ({
    user,
}))

export const loginError: UserErrorActionCreator = createAction(LOGIN_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const logout: ReduxActionCreator = createAction(LOGOUT)

export const doLogin = () => (dispatch: Function) => {
    dispatch(loginRequest())

    // simulate login
    setTimeout(() => {
        const result = {
            id: 'user-1',
            token: '37e71ec83641ae560cb2de29694f8fa2867e48e9',
        }

        dispatch(loginSuccess(result))

        localStorage.setItem('marketplace_user_id', result.id)
        localStorage.setItem('marketplace_token', result.token)
    }, 1500)
}

export const checkLogin = () => (dispatch: Function) => {
    const id: any = localStorage.getItem('marketplace_user_id')
    const token: any = localStorage.getItem('marketplace_token')

    if (id !== null && token !== null) {
        dispatch(loginSuccess({
            id,
            token,
        }))
    }
}

export const doLogout = () => (dispatch: Function) => {
    dispatch(logout())

    localStorage.removeItem('marketplace_user_id')
    localStorage.removeItem('marketplace_token')
}
