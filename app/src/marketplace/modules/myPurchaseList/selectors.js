// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Filter } from '$userpages/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'
import type {
    ProductIdList,
    ProductList,
    ProductSubscriptionList,
    ProductSubscriptionIdList,
} from '../../flowtype/product-types'
import type { MyPurchaseListState, StoreState } from '../../flowtype/store-state'

const selectMyPurchaseListState = (state: StoreState): MyPurchaseListState => state.myPurchaseList

export const selectFetchingMyPurchaseList: (state: StoreState) => boolean = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): boolean => subState.fetching,
)

export const selectMyPurchaseListSubscriptionIds: (state: StoreState) => ProductSubscriptionIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.subscriptions,
)

export const selectMyPurchaseListProductIds: (state: StoreState) => ProductIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.products,
)

export const selectMyPurchaseListIds: (state: StoreState) => ProductIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.products,
)

export const selectMyPurchaseList: (StoreState) => ProductList = createSelector(
    selectMyPurchaseListProductIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => (
        denormalize(result, productsSchema, entities)
    ),
)

export const selectMyPurchaseListError: (StoreState) => ?ErrorInUi = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): ?ErrorInUi => subState.error,
)

export const selectSubscriptions: (StoreState) => ProductSubscriptionList = createSelector(
    selectMyPurchaseListSubscriptionIds,
    selectEntities,
    (result: ProductSubscriptionIdList, entities: EntitiesState): ProductSubscriptionList => (
        denormalize(result, subscriptionsSchema, entities)
    ),
)

export const selectFilter: (StoreState) => ?Filter = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): ?Filter => subState.filter,
)
