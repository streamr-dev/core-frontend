// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ProductState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductId, Product } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import { selectEntities } from '../entities/selectors'
import { productSchema } from '../entities/schema'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectFetchingProduct: (StoreState) => boolean = createSelector(
    selectProductState,
    (subState: ProductState): boolean => subState.fetching
)

export const selectProductId: (state: StoreState) => ?ProductId = createSelector(
    selectProductState,
    (subState: ProductState): ?ProductId => subState.id
)

export const selectProduct: (state: StoreState) => ?Product = createSelector(
    selectProductId,
    selectEntities,
    (id: ?ProductId, entities: EntitiesState): ?Product => denormalize(id, productSchema, entities)
)

export const selectProductError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.error
)
