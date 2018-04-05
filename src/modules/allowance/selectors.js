// @flow

import { createSelector } from 'reselect'

import type { AllowanceState, StoreState } from '../../flowtype/store-state'

const selectAllowanceState = (state: StoreState): AllowanceState => state.allowance

export const selectAllowance: (StoreState) => number = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): number => subState.allowance
)

export const selectPendingAllowance: (StoreState) => number = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): number => subState.pendingAllowance
)

export const selectGettingAllowance: (state: StoreState) => boolean = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): boolean => subState.gettingAllowance
)

export const selectSettingAllowance: (state: StoreState) => boolean = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): boolean => subState.settingAllowance
)
