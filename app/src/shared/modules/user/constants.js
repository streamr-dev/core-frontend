// @flow

export const USER_DATA_REQUEST: string = 'shared/user/USER_DATA_REQUEST'
export const USER_DATA_SUCCESS: string = 'shared/user/USER_DATA_SUCCESS'
export const USER_DATA_FAILURE: string = 'shared/user/USER_DATA_FAILURE'

export const LOGOUT_REQUEST: string = 'shared/user/LOGOUT_REQUEST'
export const LOGOUT_SUCCESS: string = 'shared/user/LOGOUT_SUCCESS'
export const LOGOUT_FAILURE: string = 'shared/user/LOGOUT_FAILURE'

// TODO: Let's get rid of the following 2 consts after the migration to the new
//       auth stuff is complete. — Mariusz
export const EXTERNAL_LOGIN_START: string = 'shared/user/EXTERNAL_LOGIN_START'
export const EXTERNAL_LOGIN_END: string = 'shared/user/EXTERNAL_LOGIN_END'

export const SAVE_CURRENT_USER_REQUEST = 'shared/user/SAVE_CURRENT_USER_REQUEST'
export const SAVE_CURRENT_USER_SUCCESS = 'shared/user/SAVE_CURRENT_USER_SUCCESS'
export const SAVE_CURRENT_USER_FAILURE = 'shared/user/SAVE_CURRENT_USER_FAILURE'

export const UPDATE_CURRENT_USER = 'shared/user/UPDATE_CURRENT_USER'

export const UPDATE_PASSWORD_REQUEST = 'shared/user/UPDATE_PASSWORD_REQUEST'
export const UPDATE_PASSWORD_SUCCESS = 'shared/user/UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_FAILURE = 'shared/user/UPDATE_PASSWORD_FAILURE'

export const DELETE_USER_ACCOUNT_REQUEST = 'shared/user/DELETE_USER_ACCOUNT_REQUEST'
export const DELETE_USER_ACCOUNT_SUCCESS = 'shared/user/DELETE_USER_ACCOUNT_SUCCESS'
export const DELETE_USER_ACCOUNT_FAILURE = 'shared/user/DELETE_USER_ACCOUNT_FAILURE'
