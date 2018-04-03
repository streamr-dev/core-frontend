// @flow

import { createSelector } from 'reselect'

import type { PurchaseState, StoreState } from '../../flowtype/store-state'

const selectPurchaseState = (state: StoreState): PurchaseState => state.purchase

export const selectProcessingPurchase: (StoreState) => boolean = createSelector(
    selectPurchaseState,
    (subState: PurchaseState): boolean => subState.processing,
)
