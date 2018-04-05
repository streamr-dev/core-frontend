// @flow

import { createAction } from 'redux-actions'

import * as services from './services'

import type { ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { UserTokenActionCreator, UserErrorActionCreator } from './types'
import type { LoginKey, LinkedWallets } from '../../flowtype/user-types'

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LINKED_WALLETS_REQUEST,
    LINKED_WALLETS_SUCCESS,
    LINKED_WALLETS_FAILURE,
    LOGOUT,
} from './constants'

export const loginRequest: ReduxActionCreator = createAction(LOGIN_REQUEST)

export const loginSuccess: UserTokenActionCreator = createAction(LOGIN_SUCCESS, (loginKey: LoginKey) => ({
    loginKey,
}))

export const loginError: UserErrorActionCreator = createAction(LOGIN_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const linkedWalletsRequest: ReduxActionCreator = createAction(LINKED_WALLETS_REQUEST)

export const linkedWalletSuccess: UserTokenActionCreator = createAction(LINKED_WALLETS_SUCCESS, (wallets: LinkedWallets) => ({
    wallets,
}))

export const linkedWalletError: UserErrorActionCreator = createAction(LINKED_WALLETS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const logout: ReduxActionCreator = createAction(LOGOUT)

export const fetchLinkedWallets = () => (dispatch: Function) => {
    dispatch(linkedWalletsRequest())

    return services.getIntegrationKeys()
        .then((result) => {
            const linkedWallets = result.reduce((wallets, integrationKey) => ({
                ...wallets,
                [integrationKey.address]: integrationKey.name,
            }), {})

            dispatch(linkedWalletSuccess(linkedWallets))
        })
        .catch((error) => dispatch(linkedWalletError(error)))
}

export const doLogin = () => (dispatch: Function) => {
    dispatch(loginRequest())

    return services.getMyKeys()
        .then((result) => {
            const loginKey = result[0]

            dispatch(loginSuccess(loginKey))

            localStorage.setItem('marketplace_user_id', result.id)
            localStorage.setItem('marketplace_token', result.token)

            dispatch(fetchLinkedWallets())
        })
        .catch((error) => dispatch(loginError(error)))
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
