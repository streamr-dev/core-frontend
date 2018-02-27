// @flow
import { createSelector } from 'reselect'
import type { ProductState, StoreState } from '../../flowtype/store-state'
import { values } from 'lodash'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectAllProducts = createSelector(
    selectProductState,
    (subState: ProductState) => values(subState.byId)
)

export const selectError = createSelector(
    selectProductState,
    (subState: ProductState) => subState.error
)
