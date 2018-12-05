// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { AllowanceState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { NumberString } from '../../flowtype/common-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Hash, TransactionEntity } from '$shared/flowtype/web3-types'
import { transactionSchema } from '$shared/modules/entities/schema'
import { selectEntities } from '$shared/modules/entities/selectors'

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

export const selectSetAllowanceTx: (state: StoreState) => ?Hash = createSelector(
    selectAllowanceState,
    (substate: AllowanceState): ?Hash => substate.setAllowanceTx,
)

export const selectSetAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.setAllowanceError,
)

export const selectResettingAllowance: (state: StoreState) => boolean = createSelector(
    selectAllowanceState,
    (subState: AllowanceState): boolean => subState.resettingAllowance,
)

export const selectResetAllowanceTx: (state: StoreState) => ?Hash = createSelector(
    selectAllowanceState,
    (substate: AllowanceState): ?Hash => substate.resetAllowanceTx,
)

export const selectResetAllowanceTransaction: (state: StoreState) => TransactionEntity = createSelector(
    selectResetAllowanceTx,
    selectEntities,
    (resetAllowanceTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(resetAllowanceTx, transactionSchema, entities),
)

export const selectResetAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.resetAllowanceError,
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
