// @flow

import { createAction } from 'redux-actions'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { ApiKey, User } from '$shared/flowtype/user-types'
import type { Web3AccountList } from '../../flowtype/web3-types'
import type {
    ApiKeyActionCreator,
    Web3AccountsActionCreator,
    UserErrorActionCreator,
    UserDataActionCreator,
} from './types'

import * as services from './services'
import {
    API_KEYS_REQUEST,
    API_KEYS_SUCCESS,
    API_KEYS_FAILURE,
    LINKED_WEB3_ACCOUNTS_REQUEST,
    LINKED_WEB3_ACCOUNTS_SUCCESS,
    LINKED_WEB3_ACCOUNTS_FAILURE,
    LOGOUT,
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
    EXTERNAL_LOGIN_START,
    EXTERNAL_LOGIN_END,
} from './constants'

export const logout: ReduxActionCreator = createAction(LOGOUT)

// Login keys
const apiKeysRequest: ReduxActionCreator = createAction(API_KEYS_REQUEST)
const apiKeysSuccess: ApiKeyActionCreator = createAction(API_KEYS_SUCCESS, (apiKey: ApiKey) => ({
    apiKey,
}))
const apiKeysError: UserErrorActionCreator = createAction(API_KEYS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Linked web3 accounts
const linkedWeb3AccountsRequest: ReduxActionCreator = createAction(LINKED_WEB3_ACCOUNTS_REQUEST)
const linkedWeb3AccountsSuccess: Web3AccountsActionCreator = createAction(LINKED_WEB3_ACCOUNTS_SUCCESS, (accounts: Web3AccountList) => ({
    accounts,
}))
const linkedWeb3AccountsError: UserErrorActionCreator = createAction(LINKED_WEB3_ACCOUNTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Fetching user data
const getUserDataRequest: ReduxActionCreator = createAction(USER_DATA_REQUEST)
const getUserDataSuccess: UserDataActionCreator = createAction(USER_DATA_SUCCESS, (user: User) => ({
    user,
}))
const getUserDataError: UserErrorActionCreator = createAction(USER_DATA_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Fetch linked web3 accounts from integration keys
export const fetchLinkedWeb3Accounts = () => (dispatch: Function) => {
    dispatch(linkedWeb3AccountsRequest())

    return services.getIntegrationKeys()
        .then((result) => (
            result
                .filter(({ service }) => (service === 'ETHEREUM' || service === 'ETHEREUM_ID'))
                .map(({ name, json }) => ({
                    address: json.address,
                    name,
                }))
        ))
        .then((linkedWallets) => {
            dispatch(linkedWeb3AccountsSuccess(linkedWallets))
        }, (error) => {
            dispatch(linkedWeb3AccountsError(error))
        })
}

// Fetch login keys, a token is saved to local storage and used when needed (eg. in StreamLivePreview)
export const getApiKeys = () => (dispatch: Function) => {
    dispatch(apiKeysRequest())

    return services.getMyKeys()
        .then(([apiKey]) => {
            // TODO: using first key here, not sure if there are others
            dispatch(apiKeysSuccess(apiKey))
        }, (error) => {
            dispatch(apiKeysError(error))
            // Session was not found so logout from marketplace
            dispatch(logout())
        })
}

// Get user data for logged in user
export const getUserData = () => (dispatch: Function) => {
    dispatch(getUserDataRequest())

    return services.getUserData()
        .then((user) => {
            dispatch(getUserDataSuccess(user))
        }, (error) => {
            dispatch(getUserDataError(error))
        })
}

export const startExternalLogin: ReduxActionCreator = createAction(EXTERNAL_LOGIN_START)
export const endExternalLogin: ReduxActionCreator = createAction(EXTERNAL_LOGIN_END)
