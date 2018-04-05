// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { LoginKey, LinkedWallets } from '../../flowtype/user-types'

export type UserTokenAction = PayloadAction<{
    loginKey: LoginKey,
}>
export type UserTokenActionCreator = (loginKey: LoginKey) => UserTokenAction

export type UserErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type UserErrorActionCreator = (error: ErrorInUi) => UserTokenAction

export type LinkedWalletsAction = PayloadAction<{
    wallets: LinkedWallets,
}>
export type LinkedWalletsActionCreator = (LinkedWallets) => LinkedWalletsAction
