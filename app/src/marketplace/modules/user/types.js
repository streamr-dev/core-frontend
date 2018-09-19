// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ApiKey, User } from '../../flowtype/user-types'
import type { Web3AccountList } from '../../flowtype/web3-types'

export type ApiKeyAction = PayloadAction<{
    apiKey: ApiKey,
}>
export type ApiKeyActionCreator = (apiKey: ApiKey) => ApiKeyAction

export type UserProductPermissionsIdAction = PayloadAction<{
    read: boolean,
    write: boolean,
    share: boolean,
}>

export type UserDataAction = PayloadAction<{
    user: User
}>
export type UserDataActionCreator = (user: User) => UserDataAction

export type UserErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type UserErrorActionCreator = (error: ErrorInUi) => UserErrorAction

export type Web3AccountsAction = PayloadAction<{
    accounts: Web3AccountList,
}>
export type Web3AccountsActionCreator = (Web3AccountList) => Web3AccountsAction
