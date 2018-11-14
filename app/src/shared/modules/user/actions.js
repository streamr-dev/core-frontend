// @flow

import { createAction } from 'redux-actions'
import { replace } from 'react-router-redux'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { ApiKey, User, PasswordUpdate } from '$shared/flowtype/user-types'
import type { Web3AccountList } from '$mp/flowtype/web3-types'
import type {
    ApiKeyActionCreator,
    Web3AccountsActionCreator,
    UserErrorActionCreator,
    UserDataActionCreator,
    LogoutErrorActionCreator,
} from './types'
import { selectUserData } from '$shared/modules/user/selectors'

import * as services from './services'
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
    EXTERNAL_LOGIN_START,
    EXTERNAL_LOGIN_END,
    SAVE_CURRENT_USER_REQUEST,
    SAVE_CURRENT_USER_SUCCESS,
    SAVE_CURRENT_USER_FAILURE,
    UPDATE_CURRENT_USER,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
} from './constants'
import routes from '$routes'

// export const logout: ReduxActionCreator = createAction(LOGOUT)

// Logout
export const logoutRequest: ReduxActionCreator = createAction(LOGOUT_REQUEST)
export const logoutSuccess: ReduxActionCreator = createAction(LOGOUT_SUCCESS)
export const logoutFailure: LogoutErrorActionCreator = createAction(LOGOUT_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const logout = () => (dispatch: Function) => {
    dispatch(logoutRequest())
    return services
        .logout()
        .then(() => {
            dispatch(logoutSuccess())
            dispatch(replace(routes.root()))
        }, (error) => {
            dispatch(logoutFailure(error))
        })
}

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

// save cuerrent user
const saveCurrentUserRequest: ReduxActionCreator = createAction(SAVE_CURRENT_USER_REQUEST)
const saveCurrentUserSuccess: UserDataActionCreator = createAction(SAVE_CURRENT_USER_SUCCESS, (user: User) => ({
    user,
}))
const saveCurrentUserFailure: UserErrorActionCreator = createAction(SAVE_CURRENT_USER_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// update password
const updatePasswordRequest = () => ({
    type: UPDATE_PASSWORD_REQUEST,
})

const updatePasswordSuccess = () => ({
    type: UPDATE_PASSWORD_SUCCESS,
})

const updatePasswordFailure = (error: ErrorInUi) => ({
    type: UPDATE_PASSWORD_FAILURE,
    error,
})

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

const updateCurrentUser: UserDataActionCreator = createAction(UPDATE_CURRENT_USER, (user: User) => ({
    user,
}))

export const updateCurrentUserName = (name: string) => (dispatch: Function, getState: Function) => {
    const user = selectUserData(getState())
    dispatch(updateCurrentUser({
        ...user,
        name,
    }))
}

export const updateCurrentUserTimezone = (timezone: string) => (dispatch: Function, getState: Function) => {
    const user = selectUserData(getState())
    dispatch(updateCurrentUser({
        ...user,
        timezone,
    }))
}

export const saveCurrentUser = (user: User) => (dispatch: Function) => {
    dispatch(saveCurrentUserRequest())
    const form = new FormData()
    Object.keys(user).forEach((key: string) => {
        form.append(key, user[key])
    })
    return services.postUser(user)
        .then((data) => {
            dispatch(saveCurrentUserSuccess(data))
            /* dispatch(successNotification({
                title: 'Success!',
                message: 'Profile saved',
            })) */
        })
        .catch((e) => {
            dispatch(saveCurrentUserFailure(e))
            /* dispatch(errorNotification({
                title: 'Error',
                message: e.message,
            })) */
            throw e
        })
}

export const updatePassword = (passwordUpdate: PasswordUpdate) => (dispatch: Function, getState: Function): any => {
    dispatch(updatePasswordRequest())

    const user = selectUserData(getState()) || {}

    return services.postPasswordUpdate(passwordUpdate, [user.username, user.name])
        .then((data) => {
            // fancy magic to parse validation message out of HTML response
            const parser = new window.DOMParser()
            const xml = parser.parseFromString(data, 'text/html')
            const error = xml.querySelector('.has-error .text-danger')
            if (error) {
                throw new Error(error.innerText.trim())
            }
        })
        .then(() => {
            dispatch(updatePasswordSuccess())
            /* dispatch(successNotification({
                title: 'Success!',
                message: 'Password Changed',
            })) */
        }, (e) => {
            dispatch(updatePasswordFailure(e))
            /* dispatch(errorNotification({
                title: 'Password Not Changed',
                message: e.message,
            })) */
            throw e
        })
}
