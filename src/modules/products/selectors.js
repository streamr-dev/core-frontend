// @flow
import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ProductsState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { productsSchema } from '../../modules/entities/schema'

const selectProductsState = (state: StoreState): ProductsState => state.products

export const selectProductIds: (state: StoreState) => ProductIdList = createSelector(
    selectProductsState,
    (subState: ProductsState) => subState.ids
)

export const selectProducts: (StoreState) => ProductList = createSelector(
    selectProductIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities)
)

export const selectError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductsState,
    (subState: ProductsState): ?ErrorInUi => subState.error
)

export const selectSearchText: (StoreState) => string = createSelector(
    selectProductsState,
    (subState: ProductsState): string => subState.search
)

export const updateCategory: (StoreState) => ?string = createSelector(
    selectProductsState,
    (subState: ProductsState): ?string => subState.category
)
