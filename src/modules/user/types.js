// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { LoginKey } from '../../flowtype/user-types'
import type { Web3AccountList } from '../../flowtype/web3-types'

export type LoginKeyAction = PayloadAction<{
    loginKey: LoginKey,
}>
export type LoginKeyActionCreator = (loginKey: LoginKey) => LoginKeyAction

export type UserErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type UserErrorActionCreator = (error: ErrorInUi) => UserErrorAction

export type Web3AccountsAction = PayloadAction<{
    accounts: Web3AccountList,
}>
export type Web3AccountsActionCreator = (Web3AccountList) => Web3AccountsAction
