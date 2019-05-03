// @flow

import type { PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { User } from '$shared/flowtype/user-types'

export type UserDataAction = PayloadAction<{
    user: User
}>
export type UserDataActionCreator = (user: User) => UserDataAction

export type UserErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type UserErrorActionCreator = (error: ErrorInUi) => UserErrorAction
