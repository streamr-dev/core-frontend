import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { EntitiesState } from '$shared/types/store-state'
import type { ErrorInUi } from '$shared/types/common-types'
import type { Filter } from '$userpages/types/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'
import type { ProductIdList, ProductList, ProductSubscriptionList, ProductSubscriptionIdList } from '../../types/product-types'
import type { MyPurchaseListState, StoreState } from '../../types/store-state'

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
export const selectMyPurchaseList: (arg0: StoreState) => ProductList = createSelector(
    selectMyPurchaseListProductIds,
    selectEntities,
    (result: ProductIdList, entities: EntitiesState): ProductList => denormalize(result, productsSchema, entities),
)
export const selectMyPurchaseListError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): ErrorInUi | null | undefined => subState.error,
)
export const selectSubscriptions: (arg0: StoreState) => ProductSubscriptionList = createSelector(
    selectMyPurchaseListSubscriptionIds,
    selectEntities,
    (result: ProductSubscriptionIdList, entities: EntitiesState): ProductSubscriptionList => denormalize(result, subscriptionsSchema, entities),
)
export const selectFilter: (arg0: StoreState) => Filter | null | undefined = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): Filter | null | undefined => subState.filter,
)
