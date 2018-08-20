// @flow

import { createSelector } from 'reselect'

import type { PurchaseState, StoreState } from '../../flowtype/store-state'
import type { TransactionState } from '../../flowtype/common-types'
import type { Hash } from '../../flowtype/web3-types'

const selectPurchaseState = (state: StoreState): PurchaseState => state.purchase

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): ?TransactionState => subState.transactionState,
)

export const selectTransactionHash: (state: StoreState) => ?Hash = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): ?Hash => subState.hash,
)
