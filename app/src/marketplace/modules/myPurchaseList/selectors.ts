import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { EntitiesState } from '$shared/types/store-state'
import type { ErrorInUi } from '$shared/types/common-types'
import type { Filter } from '$userpages/types/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema, subscriptionsSchema } from '$shared/modules/entities/schema'
import type { ProjectIdList, ProjectList, ProjectSubscriptionList, ProjectSubscriptionIdList } from '../../types/project-types'
import type { MyPurchaseListState, StoreState } from '../../types/store-state'

const selectMyPurchaseListState = (state: StoreState): MyPurchaseListState => state.myPurchaseList

export const selectFetchingMyPurchaseList: (state: StoreState) => boolean = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): boolean => subState.fetching,
)
export const selectMyPurchaseListSubscriptionIds: (state: StoreState) => ProjectSubscriptionIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.subscriptions,
)
export const selectMyPurchaseListProductIds: (state: StoreState) => ProjectIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.products,
)
export const selectMyPurchaseListIds: (state: StoreState) => ProjectIdList = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState) => subState.products,
)
export const selectMyPurchaseList: (arg0: StoreState) => ProjectList = createSelector(
    selectMyPurchaseListProductIds,
    selectEntities,
    (result: ProjectIdList, entities: EntitiesState): ProjectList => denormalize(result, productsSchema, entities),
)
export const selectMyPurchaseListError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): ErrorInUi | null | undefined => subState.error,
)
export const selectSubscriptions: (arg0: StoreState) => ProjectSubscriptionList = createSelector(
    selectMyPurchaseListSubscriptionIds,
    selectEntities,
    (result: ProjectSubscriptionIdList, entities: EntitiesState): ProjectSubscriptionList => denormalize(result, subscriptionsSchema, entities),
)
export const selectFilter: (arg0: StoreState) => Filter | null | undefined = createSelector(
    selectMyPurchaseListState,
    (subState: MyPurchaseListState): Filter | null | undefined => subState.filter,
)
