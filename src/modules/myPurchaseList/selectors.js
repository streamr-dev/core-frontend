// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { MyPurchaseListState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductIdList, ProductList, ProductSubscription } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { productsSchema, subscriptionsSchema } from '../../modules/entities/schema'

const selectMyPurchaseListState = (state: StoreState): MyPurchaseListState => state.myPurchaseList

export const selectFetchingMyPurchaseList: (state: StoreState) => boolean = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): boolean => subState.fetching,
)

export const selectMyPurchaseListIds: (state: StoreState) => ProductIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.ids,
)

export const selectMyPurchaseList: (StoreState) => ProductList = createSelector(
    selectMyPurchaseListIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities),
)

export const selectMyPurchaseListError: (StoreState) => ?ErrorInUi = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): ?ErrorInUi => subState.error,
)

export const selectSubscriptions: (StoreState) => Array<ProductSubscription> = createSelector(
    selectMyPurchaseListIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): Array<ProductSubscription> => denormalize(result, subscriptionsSchema, entities),
)
