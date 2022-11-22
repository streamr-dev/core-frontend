import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { EntitiesState } from '$shared/types/store-state'
import type { ErrorInUi } from '$shared/types/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import type { ProjectIdList, ProjectList } from '../../types/project-types'
import type { MyProductListState, StoreState } from '../../types/store-state'

const selectMyProductListState = (state: StoreState): MyProductListState => state.myProductList

export const selectFetchingMyProductList: (state: StoreState) => boolean = createSelector(
    selectMyProductListState,
    (subState: MyProductListState): boolean => subState.fetching,
)
export const selectMyProductListIds: (state: StoreState) => ProjectIdList = createSelector(
    selectMyProductListState,
    (subState: MyProductListState) => subState.ids,
)
export const selectMyProductList: (arg0: StoreState) => ProjectList = createSelector(
    selectMyProductListIds,
    selectEntities,
    (result: ProjectIdList, entities: EntitiesState): ProjectList => denormalize(result, productsSchema, entities),
)
export const selectMyProductListError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectMyProductListState,
    (subState: MyProductListState): ErrorInUi | null | undefined => subState.error,
)
export const selectFetching: (arg0: StoreState) => boolean = createSelector(
    selectMyProductListState,
    (subState: MyProductListState): boolean => subState.fetching,
)
