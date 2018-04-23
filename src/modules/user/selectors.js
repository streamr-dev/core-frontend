// @flow

import { createSelector } from 'reselect'

import type { UserState, StoreState } from '../../flowtype/store-state'
import type { User, LoginKey } from '../../flowtype/user-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Web3AccountList } from '../../flowtype/web3-types'

const selectUserState = (state: StoreState): UserState => state.user

export const selectFetchingLoginKey: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => (subState.fetchingLoginKey !== null ? !!subState.fetchingLoginKey : true),
)

export const selectLoginKey: ((state: StoreState) => ?LoginKey) = createSelector(
    selectUserState,
    (subState: UserState): ?LoginKey => subState.loginKey,
)

export const selectUserData: ((state: StoreState) => ?User) = createSelector(
    selectUserState,
    (subState: UserState): ?User => subState.user,
)

export const selectLoginKeyError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.loginKeyError,
)

export const selectFetchingWeb3Accounts: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingWeb3Accounts,
)

export const selectWeb3Accounts: (StoreState) => ?Web3AccountList = createSelector(
    selectUserState,
    (subState: UserState): ?Web3AccountList => subState.web3Accounts,
)

export const selectWeb3AccountsError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.web3AccountsError,
)

export const selectFetchingExternalLogin: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingExternalLogin,
)
