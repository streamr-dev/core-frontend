// @flow

import { createSelector } from 'reselect'

const selectUserState = (state) => state.user

export const selectUserData = createSelector(
    selectUserState,
    (subState) => subState.user,
)
