// @flow

import { createSelector } from 'reselect'

import type { AllowanceState, StoreState } from '../../flowtype/store-state'
import type { NumberString, TransactionState } from '../../flowtype/common-types'

const selectAllowanceState = (state: StoreState): AllowanceState => state.allowance

export const selectAllowance: (StoreState) => NumberString = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): NumberString => subState.allowance,
)

export const selectPendingAllowance: (StoreState) => NumberString = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): NumberString => subState.pendingAllowance,
)

export const selectGettingAllowance: (state: StoreState) => boolean = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): boolean => subState.gettingAllowance,
)

export const selectSettingAllowance: (state: StoreState) => boolean = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): boolean => subState.settingAllowance,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): ?TransactionState => subState.transactionState,
)
