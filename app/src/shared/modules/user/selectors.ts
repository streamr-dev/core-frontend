import { createSelector } from 'reselect'
import type { UserState, StoreState } from '$shared/types/store-state'
import type { Balances } from '$shared/types/user-types'

const selectUserState = (state: StoreState): UserState => state.user
export const selectBalances: (arg0: StoreState) => Balances = createSelector(
    selectUserState,
    (subState: UserState): Balances => subState.balances,
)
