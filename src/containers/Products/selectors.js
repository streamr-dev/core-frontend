// @flow
import { createSelector } from 'reselect'
import type {ProductState} from './types'
import type {StoreState} from '../../flowtype/states/store'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectAllProducts = createSelector(
    selectProductState,
    (subState: ProductState) => subState.byId
)

export const selectError = createSelector(
    selectProductState,
    (subState: ProductState) => subState.error
)