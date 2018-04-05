// @flow

import { createSelector } from 'reselect'

import type { UserState, StoreState } from '../../flowtype/store-state'
import type { LoginKey } from '../../flowtype/user-types'
import type { ErrorInUi } from '../../flowtype/common-types'

const selectUserState = (state: StoreState): UserState => state.user

export const selectFetchingLogin: (StoreState) => boolean = createSelector(
    selectUserState,
    ((subState: UserState): boolean => subState.fetchingLogin),
)

export const selectLoginKey: ((state: StoreState) => ?LoginKey) = createSelector(
    selectUserState,
    ((subState: UserState): ?LoginKey => subState.loginKey),
)

export const selectLoginError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    ((subState: UserState): ?ErrorInUi => subState.loginError),
)
