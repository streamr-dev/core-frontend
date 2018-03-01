// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ProductListState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { productsSchema } from '../../modules/entities/schema'

const selectProductsState = (state: StoreState): ProductListState => state.productList

export const selectProductIds: (state: StoreState) => ProductIdList = createSelector(
    selectProductsState,
    (subState: ProductListState) => subState.ids
)

export const selectProducts: (StoreState) => ProductList = createSelector(
    selectProductIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities)
)

export const selectError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductsState,
    (subState: ProductListState): ?ErrorInUi => subState.error
)
