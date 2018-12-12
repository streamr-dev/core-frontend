// @flow

import { createSelector } from 'reselect'

import type { UserState, StoreState } from '$shared/flowtype/store-state'
import type { User, ApiKey } from '$shared/flowtype/user-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

const selectUserState = (state: StoreState): UserState => state.user

export const selectFetchingApiKey: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingApiKey,
)

export const selectApiKey: ((state: StoreState) => ?ApiKey) = createSelector(
    selectUserState,
    (subState: UserState): ?ApiKey => subState.apiKey,
)

export const selectFetchingUserData: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingUserData,
)

export const selectUserData: ((state: StoreState) => ?User) = createSelector(
    selectUserState,
    (subState: UserState): ?User => subState.user,
)

export const selectFetchingExternalLogin: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingExternalLogin,
)

export const selectLogoutError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.logoutError,
)
