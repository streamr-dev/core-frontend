// @flow

import { createSelector } from 'reselect'

import type { Subscription } from '../../flowtype/product-types'
import type { ProductState, StoreState } from '../../flowtype/store-state'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectContractSubscription: (StoreState) => ?Subscription = createSelector(
    selectProductState,
    (subState: ProductState): ?Subscription => subState.contractSubscription,
)
