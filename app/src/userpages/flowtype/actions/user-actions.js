// @flow

import type { User } from '$shared/flowtype/user-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import {
    SAVE_CURRENT_USER_REQUEST,
    SAVE_CURRENT_USER_SUCCESS,
    SAVE_CURRENT_USER_FAILURE,
    UPDATE_CURRENT_USER,
} from '../../modules/user/actions'

export type UserAction = {
    type: typeof SAVE_CURRENT_USER_REQUEST
} | {
    type: typeof UPDATE_CURRENT_USER
        | typeof SAVE_CURRENT_USER_SUCCESS,
    user: User
} | {
    type: typeof SAVE_CURRENT_USER_FAILURE
        | typeof SAVE_CURRENT_USER_FAILURE,
    error: ErrorInUi
}

export type PasswordUpdate = {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
}
