// @flow

import { handleActions } from 'redux-actions'

import type { UserState } from '../../flowtype/store-state'

import type {
    ApiKeyAction,
    UserDataAction,
    UserErrorAction,
    Web3AccountsAction,
} from './types'
import {
    API_KEYS_REQUEST,
    API_KEYS_SUCCESS,
    API_KEYS_FAILURE,
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

export const initialState: UserState = {
    user: null,
    fetchingUserData: false,
    userDataError: null,
    apiKey: null,
    fetchingApiKey: false,
    apiKeyError: null,
    web3Accounts: null,
    fetchingWeb3Accounts: false,
    web3AccountsError: null,
    fetchingExternalLogin: false,
}

const reducer: (UserState) => UserState = handleActions({
    [API_KEYS_REQUEST]: (state: UserState): UserState => ({
        ...state,
        fetchingApiKey: true,
    }),

    [API_KEYS_SUCCESS]: (state: UserState, action: ApiKeyAction) => ({
        ...state,
        apiKey: action.payload.apiKey,
        fetchingApiKey: false,
        apiKeyError: null,
    }),

    [API_KEYS_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingApiKey: false,
        apiKeyError: action.payload.error,
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
        fetchingUserData: false,
        user: action.payload.user,
    }),

    [USER_DATA_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingUserData: false,
        userDataError: action.payload.error,
    }),

    [LOGOUT]: (state: UserState) => ({
        ...state,
        apiKey: null,
        integrationKeys: null,
        loginError: null,
    }),

    [EXTERNAL_LOGIN_START]: (state: UserState) => ({
        ...state,
        fetchingExternalLogin: true,
    }),

    [EXTERNAL_LOGIN_END]: (state: UserState) => ({
        ...state,
        fetchingExternalLogin: false,
    }),

}, initialState)

export default reducer
