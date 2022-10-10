import { createSelector } from 'reselect'
import type { UserState, StoreState } from '$shared/types/store-state'
import type { User, Balances } from '$shared/types/user-types'
import type { ErrorInUi } from '$shared/types/common-types'

const selectUserState = (state: StoreState): UserState => state.user

export const selectFetchingUserData: (arg0: StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.fetchingUserData,
)
export const selectUserData: (state: StoreState) => User | null | undefined = createSelector(
    selectUserState,
    (subState: UserState): User | null | undefined => subState.user,
)
export const selectUsername: (state: StoreState) => string | null | undefined = createSelector(
    selectUserState,
    (subState: UserState): string | null | undefined => (subState.user || {}).username,
)
export const selectUserDataError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectUserState,
    (subState: UserState): ErrorInUi | null | undefined => subState.userDataError,
)
export const selectDeletingUserAccount: (arg0: StoreState) => boolean = createSelector(
    selectUserState,
    (subState: UserState): boolean => subState.deletingUserAccount,
)
export const selectDeleteUserAccountError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectUserState,
    (subState: UserState): ErrorInUi | null | undefined => subState.deleteUserAccountError,
)
export const isAuthenticating: (arg0: StoreState) => boolean = createSelector(
    selectFetchingUserData,
    selectUserData,
    selectUserDataError,
    (
        isFetchingUserData,
        userData,
        userDataError, // Should not redirect until fetching of user data (if started) fails or succeeds.
    ) =>
        // Note that logging out dumps user data and does NOT schedule any fetching.
        !userData && !userDataError && !!isFetchingUserData,
)
export const isAuthenticated: (arg0: StoreState) => boolean = createSelector(
    selectUserData,
    selectUserDataError,
    (userData, userDataError) => !!(userData && !userDataError),
)

/**
 * Auth attempted but failed. Differentiates initial logged out state from
 * logged out state after checking.
 */
export const authenticationFailed: (arg0: StoreState) => boolean = createSelector(
    isAuthenticated,
    selectUserDataError,
    (isAuthenticatedState, userDataError) => !isAuthenticatedState && !!userDataError,
)
type AuthState = {
    isAuthenticating: boolean
    isAuthenticated: boolean
    isLoggedOut: boolean
}
export const selectAuthState: (arg0: StoreState) => AuthState = createSelector(
    isAuthenticating,
    isAuthenticated,
    authenticationFailed,
    (isAuthenticatingState, isAuthenticatedState, authenticationFailedState) => ({
        isAuthenticating: !!isAuthenticatingState,
        isAuthenticated: !!isAuthenticatedState,
        authenticationFailed: !!authenticationFailedState,
    }),
)
export const selectBalances: (arg0: StoreState) => Balances = createSelector(
    selectUserState,
    (subState: UserState): Balances => subState.balances,
)
