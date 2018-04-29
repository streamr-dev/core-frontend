// @flow

import { createSelector } from 'reselect'

import type { ModifyContractProductState, StoreState } from '../../flowtype/store-state'
import type { TransactionState, ErrorInUi } from '../../flowtype/common-types'

const selectUpdateContractProductState = (state: StoreState): ModifyContractProductState => state.updateContractProduct

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): boolean => subState.processing,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): ?TransactionState => subState.transactionState,
)

export const selectError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectUpdateContractProductState,
    (subState: ModifyContractProductState): ?ErrorInUi => subState.error,
)
