// @flow
import { createSelector } from 'reselect'
import type { EntitiesState, StoreState } from '../../flowtype/store-state'
import type { ProductEntities } from '../../flowtype/product-types'

export const selectEntities = (state: StoreState): EntitiesState => state.entities

export const selectProductEntities: (EntitiesState) => ?ProductEntities = createSelector(
    selectEntities,
    (subState: EntitiesState): ?ProductEntities => subState.products ? subState.products : {}
)
