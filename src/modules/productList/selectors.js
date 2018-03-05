// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ProductListState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { productsSchema } from '../../modules/entities/schema'

const selectProductListState = (state: StoreState): ProductListState => state.productList

export const selectFetchingProductList: (state: StoreState) => boolean = createSelector(
    selectProductListState,
    (subState: ProductListState): boolean => subState.fetching
)

export const selectProductListIds: (state: StoreState) => ProductIdList = createSelector(
    selectProductListState,
    (subState: ProductListState) => subState.ids
)

export const selectProductList: (StoreState) => ProductList = createSelector(
    selectProductListIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities)
)

export const selectSearchText: (StoreState) => string = createSelector(
    selectProductListState,
    (subState: ProductListState): string => subState.search
)

export const updateCategory: (StoreState) => ?string = createSelector(
    selectProductListState,
    (subState: ProductListState): ?string => subState.category
)

export const selectProductListError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductListState,
    (subState: ProductListState): ?ErrorInUi => subState.error
)
