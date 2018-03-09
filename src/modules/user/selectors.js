// @flow

import { createSelector } from 'reselect'

import type { UserState, StoreState } from '../../flowtype/store-state'
import type { UserToken } from '../../flowtype/user-types'
import type { ErrorInUi } from '../../flowtype/common-types'

const selectUserState = (state: StoreState): UserState => state.user

export const selectFetchingToken: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingToken
)

export const selectToken: (state: StoreState) => ?UserToken = createSelector(
    selectUserState,
    (subState: UserState): ?UserToken => subState.token
)

export const selectTokenError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.tokenError
)
