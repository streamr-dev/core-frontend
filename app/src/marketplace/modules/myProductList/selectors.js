// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { MyProductListState, StoreState } from '../../flowtype/store-state'

const selectMyProductListState = (state: StoreState): MyProductListState => state.myProductList

export const selectFetchingMyProductList: (state: StoreState) => boolean = createSelector(
    selectMyProductListState,
    (subState: MyProductListState): boolean => subState.fetching,
)

export const selectMyProductListIds: (state: StoreState) => ProductIdList = createSelector(
    selectMyProductListState,
    (subState: MyProductListState) => subState.ids,
)

export const selectMyProductList: (StoreState) => ProductList = createSelector(
    selectMyProductListIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities),
)

export const selectMyProductListError: (StoreState) => ?ErrorInUi = createSelector(
    selectMyProductListState,
    (subState: MyProductListState): ?ErrorInUi => subState.error,
)

export const selectFetching: (StoreState) => boolean = createSelector(
    selectMyProductListState,
    (subState: MyProductListState): boolean => subState.fetching,
)
