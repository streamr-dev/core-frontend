// @flow

import { createSelector } from 'reselect'

import type { AllowanceState, StoreState } from '../../flowtype/store-state'
import type { ErrorInUi, NumberString, TransactionState } from '../../flowtype/common-types'

const selectAllowanceState = (state: StoreState): AllowanceState => state.allowance

export const selectAllowance: (StoreState) => NumberString = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): NumberString => subState.allowance,
)

export const selectPendingAllowance: (StoreState) => ?NumberString = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): ?NumberString => subState.pendingAllowance,
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

export const selectAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.error,
)

// Pending allowance is set if there is an ongoing transaction to set new allowance
export const selectAllowanceOrPendingAllowance: (state: StoreState) => NumberString = createSelector(
    selectAllowance,
    selectPendingAllowance,
    (allowance: NumberString, pendingAllowance: ?NumberString): NumberString =>
        (pendingAllowance === null ?
            allowance :
            ((pendingAllowance: any): NumberString)),
)
