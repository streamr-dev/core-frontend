// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { AllowanceState } from '$mp/flowtype/store-state'
import type { EntitiesState, StoreState } from '$shared/flowtype/store-state'
import type { NumberString, ErrorInUi } from '$shared/flowtype/common-types'
import type { Hash, TransactionEntity } from '$shared/flowtype/web3-types'
import { transactionSchema } from '$shared/modules/entities/schema'
import { selectEntities } from '$shared/modules/entities/selectors'

// DATA Allowance selectors
const selectDataAllowanceState = (state: StoreState): AllowanceState => state.allowance

export const selectDataAllowance: (StoreState) => NumberString = createSelector(
    selectDataAllowanceState,
    (subState: AllowanceState): NumberString => subState.dataAllowance,
)

export const selectPendingDataAllowance: (StoreState) => ?NumberString = createSelector(
    selectDataAllowanceState,
    (subState: AllowanceState): ?NumberString => subState.pendingDataAllowance,
)

export const selectGettingDataAllowance: (state: StoreState) => boolean = createSelector(
    selectDataAllowanceState,
    (subState: AllowanceState): boolean => subState.gettingDataAllowance,
)

export const selectSettingDataAllowance: (state: StoreState) => boolean = createSelector(
    selectDataAllowanceState,
    (subState: AllowanceState): boolean => subState.settingDataAllowance,
)

export const selectSetDataAllowanceTx: (state: StoreState) => ?Hash = createSelector(
    selectDataAllowanceState,
    (substate: AllowanceState): ?Hash => substate.setDataAllowanceTx,
)

export const selectSetDataAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectDataAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.setDataAllowanceError,
)

export const selectResettingDataAllowance: (state: StoreState) => boolean = createSelector(
    selectDataAllowanceState,
    (subState: AllowanceState): boolean => subState.resettingDataAllowance,
)

export const selectResetDataAllowanceTx: (state: StoreState) => ?Hash = createSelector(
    selectDataAllowanceState,
    (substate: AllowanceState): ?Hash => substate.resetDataAllowanceTx,
)

export const selectResetDataAllowanceTransaction: (state: StoreState) => TransactionEntity = createSelector(
    selectResetDataAllowanceTx,
    selectEntities,
    (resetDataAllowanceTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(resetDataAllowanceTx, transactionSchema, entities),
)

export const selectResetDataAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectDataAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.resetDataAllowanceError,
)

// Pending allowance is set if there is an ongoing transaction to set new allowance
export const selectDataAllowanceOrPendingDataAllowance: (state: StoreState) => NumberString = createSelector(
    selectDataAllowance,
    selectPendingDataAllowance,
    (allowance: NumberString, pendingAllowance: ?NumberString): NumberString =>
        (pendingAllowance === null ?
            allowance :
            ((pendingAllowance: any): NumberString)),
)

// DAI Allowance selectors
const selectDaiAllowanceState = (state: StoreState): AllowanceState => state.allowance

export const selectDaiAllowance: (StoreState) => NumberString = createSelector(
    selectDaiAllowanceState,
    (subState: AllowanceState): NumberString => subState.daiAllowance,
)

export const selectPendingDaiAllowance: (StoreState) => ?NumberString = createSelector(
    selectDaiAllowanceState,
    (subState: AllowanceState): ?NumberString => subState.pendingDaiAllowance,
)

export const selectGettingDaiAllowance: (state: StoreState) => boolean = createSelector(
    selectDaiAllowanceState,
    (subState: AllowanceState): boolean => subState.gettingDaiAllowance,
)

export const selectSettingDaiAllowance: (state: StoreState) => boolean = createSelector(
    selectDaiAllowanceState,
    (subState: AllowanceState): boolean => subState.settingDaiAllowance,
)

export const selectSetDaiAllowanceTx: (state: StoreState) => ?Hash = createSelector(
    selectDaiAllowanceState,
    (substate: AllowanceState): ?Hash => substate.setDaiAllowanceTx,
)

export const selectSetDaiAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectDaiAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.setDaiAllowanceError,
)

export const selectResettingDaiAllowance: (state: StoreState) => boolean = createSelector(
    selectDaiAllowanceState,
    (subState: AllowanceState): boolean => subState.resettingDaiAllowance,
)

export const selectResetDaiAllowanceTx: (state: StoreState) => ?Hash = createSelector(
    selectDaiAllowanceState,
    (substate: AllowanceState): ?Hash => substate.resetDaiAllowanceTx,
)

export const selectResetDaiAllowanceTransaction: (state: StoreState) => TransactionEntity = createSelector(
    selectResetDaiAllowanceTx,
    selectEntities,
    (resetDaiAllowanceTx: ?Hash, entities: EntitiesState): TransactionEntity => denormalize(resetDaiAllowanceTx, transactionSchema, entities),
)

export const selectResetDaiAllowanceError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectDaiAllowanceState,
    (substate: AllowanceState): ?ErrorInUi => substate.resetDaiAllowanceError,
)

// Pending allowance is set if there is an ongoing transaction to set new allowance
export const selectDaiAllowanceOrPendingDaiAllowance: (state: StoreState) => NumberString = createSelector(
    selectDaiAllowance,
    selectPendingDaiAllowance,
    (allowance: NumberString, pendingAllowance: ?NumberString): NumberString =>
        (pendingAllowance === null ?
            allowance :
            ((pendingAllowance: any): NumberString)),
)
