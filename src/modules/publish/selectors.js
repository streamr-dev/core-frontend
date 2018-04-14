// @flow

import { createSelector } from 'reselect'

import type { PublishState, StoreState } from '../../flowtype/store-state'
import type { TransactionState, ErrorInUi } from '../../flowtype/common-types'

const selectPublishState = (state: StoreState): PublishState => state.publish

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectPublishState,
    (subState: PublishState): boolean => subState.processing,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectPublishState,
    (subState: PublishState): ?TransactionState => subState.transactionState,
)

export const selectError: (state: StoreState) => ?ErrorInUi = createSelector(
    selectPublishState,
    (subState: PublishState): ?ErrorInUi => subState.error,
)
