// @flow

import { createSelector } from 'reselect'

import type { ProductState, StoreState } from '../../flowtype/store-state'
import type { ErrorInUi } from '../../flowtype/common-types'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectFetching: (StoreState) => boolean = createSelector(
    selectProductState,
    (subState: ProductState): boolean => subState.fetching
)

export const selectError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.error
)
