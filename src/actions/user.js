// @flow

import { success as successNotification, error as errorNotification } from 'react-notification-system-redux'

import type { ErrorInUi } from '../flowtype/common-types'
import type { User } from '../flowtype/user-types'
import * as api from '../utils/api'

export const GET_CURRENT_USER_REQUEST = 'GET_CURRENT_USER_REQUEST'
export const GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS'
export const GET_CURRENT_USER_FAILURE = 'GET_CURRENT_USER_FAILURE'

export const SAVE_CURRENT_USER_REQUEST = 'SAVE_CURRENT_USER_REQUEST'
export const SAVE_CURRENT_USER_SUCCESS = 'SAVE_CURRENT_USER_SUCCESS'
export const SAVE_CURRENT_USER_FAILURE = 'SAVE_CURRENT_USER_FAILURE'

export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER'

const apiUrl = `${process.env.STREAMR_API_URL}/users`

const updateCurrentUser = (user: User) => ({
    type: UPDATE_CURRENT_USER,
    user,
})

const getCurrentUserRequest = () => ({
    type: GET_CURRENT_USER_REQUEST,
})

const getCurrentUserSuccess = (user: User) => ({
    type: GET_CURRENT_USER_SUCCESS,
    user,
})

const getCurrentUserFailure = (error: ErrorInUi) => ({
    type: GET_CURRENT_USER_FAILURE,
    error,
})

const saveCurrentUserRequest = () => ({
    type: SAVE_CURRENT_USER_REQUEST,
})

const saveCurrentUserSuccess = (user: User) => ({
    type: SAVE_CURRENT_USER_SUCCESS,
    user,
})

const saveCurrentUserFailure = (error: ErrorInUi) => ({
    type: SAVE_CURRENT_USER_FAILURE,
    error,
})

export const getCurrentUser = () => (dispatch: Function) => {
    dispatch(getCurrentUserRequest())
    return api.get(`${apiUrl}/me`)
        .then((data) => dispatch(getCurrentUserSuccess(data)))
        .catch((e) => {
            dispatch(getCurrentUserFailure(e))
            dispatch(errorNotification({
                title: 'Error',
                message: e.message,
            }))
            throw e
        })
}

export const saveCurrentUser = (user: User) => (dispatch: Function) => {
    dispatch(saveCurrentUserRequest())
    const form = new FormData()
    Object.keys(user).forEach((key: string) => {
        form.append(key, user[key])
    })
    return api.post(`${process.env.STREAMR_API_URL}/profile/update`, form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then((data) => {
            dispatch(saveCurrentUserSuccess(data))
            dispatch(successNotification({
                title: 'Success!',
                message: 'Profile saved',
            }))
        })
        .catch((e) => {
            dispatch(saveCurrentUserFailure(e))
            dispatch(errorNotification({
                title: 'Error',
                message: e.message,
            }))
            throw e
        })
}

export const updateCurrentUserName = (name: string) => (dispatch: Function, getState: Function) => {
    const state = getState()
    const user = state.user.currentUser
    dispatch(updateCurrentUser({
        ...user,
        name,
    }))
}

export const updateCurrentUserTimezone = (timezone: string) => (dispatch: Function, getState: Function) => {
    const state = getState()
    const user = state.user.currentUser
    dispatch(updateCurrentUser({
        ...user,
        timezone,
    }))
}
