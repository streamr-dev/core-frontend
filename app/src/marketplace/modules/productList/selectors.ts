import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import { EntitiesState } from '$shared/types/store-state'
import { ErrorInUi } from '$shared/types/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import { ProjectIdList, ProjectList, Filter } from '../../types/project-types'
import { ProductListState, ProjectAuthor, StoreState } from '../../types/store-state'

const selectProductListState = (state: StoreState): ProductListState => state.productList

export const selectFetchingProductList: (state: StoreState) => boolean = createSelector(
    selectProductListState,
    (subState: ProductListState): boolean => subState.fetching,
)
export const selectProductListIds: (state: StoreState) => ProjectIdList = createSelector(
    selectProductListState,
    (subState: ProductListState) => subState.ids,
)
export const selectProductList: (arg0: StoreState) => ProjectList = createSelector(
    selectProductListIds,
    selectEntities,
    (result: ProjectIdList, entities: EntitiesState): ProjectList => denormalize(result, productsSchema, entities),
)
export const selectFilter: (arg0: StoreState) => Filter = createSelector(
    selectProductListState,
    (subState: ProductListState): Filter => subState.filter,
)
export const selectProductListError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectProductListState,
    (subState: ProductListState): ErrorInUi | null | undefined => subState.error,
)
export const selectPageSize: (arg0: StoreState) => number = createSelector(
    selectProductListState,
    (subState: ProductListState): number => subState.pageSize,
)
export const selectOffset: (arg0: StoreState) => number = createSelector(
    selectProductListState,
    (subState: ProductListState): number => subState.offset,
)
export const selectHasMoreSearchResults: (arg0: StoreState) => boolean = createSelector(
    selectProductListState,
    (subState: ProductListState): boolean => !!subState.hasMoreSearchResults,
)
export const selectProjectsAuthorFilter: (state: StoreState) => ProjectAuthor = createSelector(
    selectProductListState,
    (subState: ProductListState): ProjectAuthor => subState.projectAuthor
)
