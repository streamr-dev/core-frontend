// @flow

import { handleActions } from 'redux-actions'

import type { UserState } from '../../flowtype/store-state'

import {
    LOGIN_KEYS_REQUEST,
    LOGIN_KEYS_SUCCESS,
    LOGIN_KEYS_FAILURE,
    LINKED_WEB3_ACCOUNTS_REQUEST,
    LINKED_WEB3_ACCOUNTS_SUCCESS,
    LINKED_WEB3_ACCOUNTS_FAILURE,
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
    LOGOUT,
    EXTERNAL_LOGIN_START,
    EXTERNAL_LOGIN_END,
} from './constants'
import type {
    LoginKeyAction,
    UserDataAction,
    UserErrorAction,
    Web3AccountsAction,
} from './types'

const initialState: UserState = {
    user: null,
    fetchingUserData: false,
    userDataError: null,
    loginKey: null,
    fetchingLoginKey: false,
    loginKeyError: null,
    web3Accounts: null,
    fetchingWeb3Accounts: false,
    web3AccountsError: null,
}

const reducer: (UserState) => UserState = handleActions({
    [LOGIN_KEYS_REQUEST]: (state: UserState): UserState => ({
        ...state,
        fetchingLogin: true,
    }),

    [LOGIN_KEYS_SUCCESS]: (state: UserState, action: LoginKeyAction) => ({
        ...state,
        loginKey: action.payload.loginKey,
        fetchingLogin: false,
        loginKeyError: null,
    }),

    [LOGIN_KEYS_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingLogin: false,
        loginKeyError: action.payload.error,
    }),

    [LINKED_WEB3_ACCOUNTS_REQUEST]: (state: UserState) => ({
        ...state,
        fetchingWeb3Accounts: true,
    }),

    [LINKED_WEB3_ACCOUNTS_SUCCESS]: (state: UserState, action: Web3AccountsAction) => ({
        ...state,
        fetchingWeb3Accounts: false,
        web3Accounts: action.payload.accounts,
    }),

    [LINKED_WEB3_ACCOUNTS_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingWeb3Accounts: false,
        web3AccountsError: action.payload.error,
    }),

    [USER_DATA_REQUEST]: (state: UserState) => ({
        ...state,
        fetchingUserData: true,
    }),

    [USER_DATA_SUCCESS]: (state: UserState, action: UserDataAction) => ({
        ...state,
        user: action.payload.user,
    }),

    [USER_DATA_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        userDataError: action.payload.error,
    }),

    [LOGOUT]: (state: UserState) => ({
        ...state,
        loginKey: null,
        integrationKeys: null,
        loginError: null,
    }),

    [EXTERNAL_LOGIN_START]: (state: UserState) => ({
        ...state,
        fetchingLoginKey: true,
    }),

    [EXTERNAL_LOGIN_END]: (state: UserState) => ({
        ...state,
        fetchingLoginKey: false,
    }),

}, initialState)

export default reducer
