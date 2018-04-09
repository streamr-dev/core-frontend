// @flow

import { createSelector } from 'reselect'

import type { PurchaseState, StoreState } from '../../flowtype/store-state'
import type { TransactionState } from '../../flowtype/common-types'

const selectPurchaseState = (state: StoreState): PurchaseState => state.purchase

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): boolean => subState.processing,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): ?TransactionState => subState.transactionState,
)
