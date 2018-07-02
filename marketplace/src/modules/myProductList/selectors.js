// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { MyProductListState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductIdList, ProductList } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { productsSchema } from '../../modules/entities/schema'

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
