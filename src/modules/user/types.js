// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { UserToken } from '../../flowtype/user-types'

export type UserTokenAction = PayloadAction<{
    user: UserToken,
}>
export type UserTokenActionCreator = (user: UserToken) => UserTokenAction

export type UserErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type UserErrorActionCreator = (error: ErrorInUi) => UserTokenAction
