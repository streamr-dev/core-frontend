// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import type { ProductIdList, ProductList, Filter } from '../../flowtype/product-types'
import type { ProductListState, StoreState } from '../../flowtype/store-state'

const selectProductListState = (state: StoreState): ProductListState => state.productList

export const selectFetchingProductList: (state: StoreState) => boolean = createSelector(
    selectProductListState,
    (subState: ProductListState): boolean => subState.fetching,
)

export const selectProductListIds: (state: StoreState) => ProductIdList = createSelector(
    selectProductListState,
    (subState: ProductListState) => subState.ids,
)

export const selectProductList: (StoreState) => ProductList = createSelector(
    selectProductListIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities),
)

export const selectFilter: (StoreState) => Filter = createSelector(
    selectProductListState,
    (subState: ProductListState): Filter => subState.filter,
)

export const selectProductListError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductListState,
    (subState: ProductListState): ?ErrorInUi => subState.error,
)

export const selectPageSize: (StoreState) => number = createSelector(
    selectProductListState,
    (subState: ProductListState): number => subState.pageSize,
)

export const selectOffset: (StoreState) => number = createSelector(
    selectProductListState,
    (subState: ProductListState): number => subState.offset,
)

export const selectHasMoreSearchResults: (StoreState) => boolean = createSelector(
    selectProductListState,
    (subState: ProductListState): boolean => !!subState.hasMoreSearchResults,
)
