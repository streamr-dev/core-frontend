import type { PayloadAction, ErrorInUi } from '$shared/types/common-types'
import type { User, Balances } from '$shared/types/user-types'
export type UserDataAction = PayloadAction<{
    user: User
}>
export type UserDataActionCreator = (user: User) => UserDataAction
export type UserErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type UserErrorActionCreator = (error: ErrorInUi) => UserErrorAction
export type SetBalanceAction = PayloadAction<{
    balances: Balances
}>
export type SetBalanceActionCreator = (arg0: Balances) => SetBalanceAction
