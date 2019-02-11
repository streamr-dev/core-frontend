// @flow

import { createSelector } from 'reselect'

import type { UserState, StoreState } from '$shared/flowtype/store-state'
import type { User } from '$shared/flowtype/user-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

const selectUserState = (state: StoreState): UserState => state.user

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

export const selectUserDataError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.userDataError,
)

export const selectDeletingUserAccount: (StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.deletingUserAccount,
)

export const selectDeleteUserAccountError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserState,
    (subState: UserState): ?ErrorInUi => subState.deleteUserAccountError,
)

export const isAuthenticating: (StoreState) => boolean = createSelector(
    selectFetchingUserData,
    selectFetchingExternalLogin,
    selectUserData,
    selectUserDataError,
    (isFetchingUserData, isFetchingExternalLogin, userData, userDataError) => {
        // should not redirect until fetching of user data succeeds or fails
        const isFetching = isFetchingUserData || isFetchingExternalLogin
        const didFetch = userData || userDataError
        return !!(isFetching || !didFetch)
    },
)
