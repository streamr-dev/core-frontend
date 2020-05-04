// @flow

import { createAction } from 'redux-actions'
import { push } from 'connected-react-router'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { User, PasswordUpdate } from '$shared/flowtype/user-types'
import type {
    UserErrorActionCreator,
    UserDataActionCreator,
} from './types'
import { selectUserData } from '$shared/modules/user/selectors'
import routes from '$routes'

import * as services from './services'
import {
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
    SAVE_CURRENT_USER_REQUEST,
    SAVE_CURRENT_USER_SUCCESS,
    SAVE_CURRENT_USER_FAILURE,
    UPDATE_CURRENT_USER,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAILURE,
    UPDATE_AVATAR_REQUEST,
    UPDATE_AVATAR_SUCCESS,
    UPDATE_AVATAR_FAILURE,
    RESET_USER_DATA,
    DELETE_USER_ACCOUNT_REQUEST,
    DELETE_USER_ACCOUNT_SUCCESS,
    DELETE_USER_ACCOUNT_FAILURE,
} from './constants'
import { clearStorage } from '$shared/utils/storage'

// Logout
export const resetUserData: ReduxActionCreator = createAction(RESET_USER_DATA)

export const logout = () => (dispatch: Function) => {
    clearStorage()
    dispatch(resetUserData())
    dispatch(push(routes.platform()))
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

// Update user avatar
const updateAvatarRequest = () => ({
    type: UPDATE_AVATAR_REQUEST,
})
const updateAvatarSuccess = () => ({
    type: UPDATE_AVATAR_SUCCESS,
})
const updateAvatarFailure = (error: ErrorInUi) => ({
    type: UPDATE_AVATAR_FAILURE,
    error,
})

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

const updateCurrentUser: UserDataActionCreator = createAction(UPDATE_CURRENT_USER, (user: User) => ({
    user,
}))

export const updateCurrentUserName = (name: string) => (dispatch: Function, getState: Function) => {
    const user = selectUserData(getState())
    if (user) {
        dispatch(updateCurrentUser({
            ...user,
            name,
        }))
    }
}

export const updateCurrentUserImage = (image: ?File) => (dispatch: Function, getState: Function) => {
    dispatch(updateAvatarRequest())
    const user = selectUserData(getState())

    if (!user || !image) {
        throw new Error('Invalid user data or uploaded image')
    }

    return services.uploadProfileAvatar(image)
        .then((avatar) => {
            dispatch(updateAvatarSuccess())
            dispatch(updateCurrentUser({
                ...user,
                ...avatar,
            }))
        })
        .catch((e) => {
            dispatch(updateAvatarFailure(e))
            throw e
        })
}

export const saveCurrentUser = () => async (dispatch: Function, getState: Function) => {
    dispatch(saveCurrentUserRequest())

    const user = selectUserData(getState())

    if (!user) {
        throw new Error('Invalid user data')
    }

    return services.putUser(user)
        .then((data) => {
            dispatch(saveCurrentUserSuccess(data))
        })
        .catch((e) => {
            dispatch(saveCurrentUserFailure(e))
            throw e
        })
}

export const updatePassword = (passwordUpdate: PasswordUpdate) => (dispatch: Function, getState: Function): any => {
    dispatch(updatePasswordRequest())

    const user = selectUserData(getState()) || {}

    return services.postPasswordUpdate(passwordUpdate, user.username)
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
        }, (e) => {
            dispatch(updatePasswordFailure(e))
            throw e
        })
}

export const deleteUserAccount = () => (dispatch: Function) => {
    dispatch(deleteUserAccountRequest())

    return services.deleteUserAccount()
        .then(() => {
            dispatch(deleteUserAccountSuccess())
        }, (error) => {
            dispatch(deleteUserAccountFailure({
                message: error.message,
            }))
            throw error
        })
}
