// @flow

import { createAction } from 'redux-actions'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { User, PasswordUpdate } from '$shared/flowtype/user-types'
import type {
    UserErrorActionCreator,
    UserDataActionCreator,
    LogoutErrorActionCreator,
} from './types'
import { selectUserData } from '$shared/modules/user/selectors'

import * as services from './services'
import {
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
    DELETE_USER_ACCOUNT_REQUEST,
    DELETE_USER_ACCOUNT_SUCCESS,
    DELETE_USER_ACCOUNT_FAILURE,
} from './constants'
import routes from '$routes'

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
            window.location.replace(routes.externalLogout())
            // NOTE: Replace the above line with the following when the backend
            //       auth stuff is fixed. — Mariusz
            // dispatch(replace(routes.root()))
        }, (error) => {
            dispatch(logoutFailure(error))
        })
}

// Fetching user data
const getUserDataRequest: ReduxActionCreator = createAction(USER_DATA_REQUEST)
const getUserDataSuccess: UserDataActionCreator = createAction(USER_DATA_SUCCESS, (user: User) => ({
    user,
}))
const getUserDataError: UserErrorActionCreator = createAction(USER_DATA_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// save current user
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

// remove user account
const deleteUserAccountRequest: ReduxActionCreator = createAction(DELETE_USER_ACCOUNT_REQUEST)
const deleteUserAccountSuccess: ReduxActionCreator = createAction(DELETE_USER_ACCOUNT_SUCCESS)
const deleteUserAccountFailure: UserErrorActionCreator = createAction(
    DELETE_USER_ACCOUNT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

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

export const updateCurrentUserImage = (image: ?string) => (dispatch: Function, getState: Function) => {
    const user = selectUserData(getState())
    return services.uploadProfileAvatar()
        .then(() => {
            dispatch(updateCurrentUser({
                ...user,
                imageUrl: image,
            }))
        })
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

export const deleteUserAccount = () => (dispatch: Function) => {
    dispatch(deleteUserAccountRequest())

    return services.deleteUserAccount()
        .then(() => {
            dispatch(deleteUserAccountSuccess())
            dispatch(logout())
        }, (error) => {
            dispatch(deleteUserAccountFailure({
                message: error.message,
            }))
            throw error
        })
}
