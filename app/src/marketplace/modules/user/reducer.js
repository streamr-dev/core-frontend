// @flow

import { handleActions } from 'redux-actions'

import type { UserState } from '../../flowtype/store-state'

import type {
    ApiKeyAction,
    UserDataAction,
    UserErrorAction,
    Web3AccountsAction,
    UserProductPermissionsIdAction,
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
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
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
    productPermissions: {
        read: false,
        write: false,
        share: false,
        fetchingPermissions: false,
        permissionsError: null,
    },
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

    [GET_USER_PRODUCT_PERMISSIONS_REQUEST]: (state: UserState) => ({
        ...state,
        productPermissions: {
            ...state.productPermissions,
            read: false,
            write: false,
            share: false,
            fetchingPermissions: true,
            permissionsError: null,
        },
    }),

    [GET_USER_PRODUCT_PERMISSIONS_SUCCESS]: (state: UserState, action: UserProductPermissionsIdAction) => ({
        ...state,
        productPermissions: {
            ...state.productPermissions,
            read: action.payload.read,
            write: action.payload.write,
            share: action.payload.share,
            fetchingPermissions: false,
            permissionsError: null,
        },
    }),

    [GET_USER_PRODUCT_PERMISSIONS_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        productPermissions: {
            ...state.productPermissions,
            read: false,
            write: false,
            share: false,
            fetchingPermissions: false,
            permissionsError: action.payload.error,
        },
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
