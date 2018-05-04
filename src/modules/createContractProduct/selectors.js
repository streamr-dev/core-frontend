// @flow

import { createSelector } from 'reselect'

import type { ModifyContractProductState, StoreState } from '../../flowtype/store-state'
import type { TransactionState, ErrorInUi } from '../../flowtype/common-types'

const selectCreateContractProductState = (state: StoreState): ModifyContractProductState => state.createContractProduct

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): boolean => subState.processing,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): ?TransactionState => subState.transactionState,
)

export const selectError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectCreateContractProductState,
    (subState: ModifyContractProductState): ?ErrorInUi => subState.error,
)
