// @flow

import { createSelector } from 'reselect'

import type { ModifyContractProductState, StoreState } from '../../flowtype/store-state'
import type { TransactionState, ErrorInUi } from '../../flowtype/common-types'

const selectModifyContractProductState = (state: StoreState): ModifyContractProductState => state.createContractProduct

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectModifyContractProductState,
    (subState: ModifyContractProductState): boolean => subState.processing,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectModifyContractProductState,
    (subState: ModifyContractProductState): ?TransactionState => subState.transactionState,
)

export const selectError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectModifyContractProductState,
    (subState: ModifyContractProductState): ?ErrorInUi => subState.error,
)
