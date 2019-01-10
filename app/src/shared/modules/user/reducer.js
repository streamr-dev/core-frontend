// @flow

import { handleActions } from 'redux-actions'

import type { UserState } from '$shared/flowtype/store-state'

import type {
    UserDataAction,
    UserErrorAction,
    LogoutErrorAction,
} from './types'
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
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    DELETE_USER_ACCOUNT_REQUEST,
    DELETE_USER_ACCOUNT_SUCCESS,
    DELETE_USER_ACCOUNT_FAILURE,
} from './constants'

export const initialState: UserState = {
    user: null,
    fetchingUserData: false,
    userDataError: null,
    fetchingExternalLogin: false,
    saved: true,
    logoutError: null,
    fetchingLogout: false,
    deletingUserAccount: false,
    deleteUserAccountError: null,
}

const reducer: (UserState) => UserState = handleActions({
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

    [LOGOUT_REQUEST]: (state: UserState) => ({
        ...state,
        fetchingLogout: true,
        logoutError: null,
    }),

    [LOGOUT_SUCCESS]: () => ({
        ...initialState,
    }),

    [LOGOUT_FAILURE]: (state: UserState, action: LogoutErrorAction) => ({
        ...state,
        fetchingLogout: false,
        logoutError: action.payload.error,
    }),

    [EXTERNAL_LOGIN_START]: (state: UserState) => ({
        ...state,
        fetchingExternalLogin: true,
    }),

    [EXTERNAL_LOGIN_END]: (state: UserState) => ({
        ...state,
        fetchingExternalLogin: false,
    }),

    [SAVE_CURRENT_USER_REQUEST]: (state: UserState) => ({
        ...state,
        fetchingUserData: true,
    }),

    [SAVE_CURRENT_USER_SUCCESS]: (state: UserState, action: UserDataAction) => ({
        ...state,
        user: action.payload.user,
        fetchingUserData: false,
        saved: true,
        userDataError: null,
    }),

    [SAVE_CURRENT_USER_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        fetchingUserData: false,
        userDataError: action.payload.error,
    }),

    [UPDATE_CURRENT_USER]: (state: UserState, action: UserDataAction) => ({
        ...state,
        saved: false,
        user: {
            ...(state.user || {}),
            ...action.payload.user,
        },
    }),

    [DELETE_USER_ACCOUNT_REQUEST]: (state: UserState) => ({
        ...state,
        deletingUserAccount: true,
    }),

    [DELETE_USER_ACCOUNT_SUCCESS]: (state: UserState) => ({
        ...state,
        deletingUserAccount: false,
    }),

    [DELETE_USER_ACCOUNT_FAILURE]: (state: UserState, action: UserErrorAction) => ({
        ...state,
        deletingUserAccount: false,
        deleteUserAccountError: action.payload.error,
    }),

}, initialState)

export default reducer
