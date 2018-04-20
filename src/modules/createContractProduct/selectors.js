// @flow

import { createSelector } from 'reselect'

import type { CreateContractProductState, StoreState } from '../../flowtype/store-state'
import type { TransactionState, ErrorInUi } from '../../flowtype/common-types'

const selectCreateContractProductState = (state: StoreState): CreateContractProductState => state.createContractProduct

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectCreateContractProductState,
    (subState: CreateContractProductState): boolean => subState.processing,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectCreateContractProductState,
    (subState: CreateContractProductState): ?TransactionState => subState.transactionState,
)

export const selectError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectCreateContractProductState,
    (subState: CreateContractProductState): ?ErrorInUi => subState.error,
)
