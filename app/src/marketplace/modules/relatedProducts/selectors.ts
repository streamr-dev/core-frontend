import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import { EntitiesState } from '$shared/types/store-state'
import { ErrorInUi } from '$shared/types/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { productsSchema } from '$shared/modules/entities/schema'
import { ProjectIdList, ProjectList } from '../../types/project-types'
import { RelatedProductListState, StoreState } from '../../types/store-state'

const selectRelatedProductListState = (state: StoreState): RelatedProductListState => state.relatedProducts

export const selectFetchingRelatedProductList: (state: StoreState) => boolean = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState): boolean => subState.fetching,
)
export const selectRelatedProductListIds: (state: StoreState) => ProjectIdList = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState) => subState.ids,
)
export const selectRelatedProductList: (arg0: StoreState) => ProjectList = createSelector(
    selectRelatedProductListIds,
    selectEntities,
    (result: ProjectIdList, entities: EntitiesState): ProjectList => denormalize(result, productsSchema, entities),
)
export const selectRelatedProductListError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState): ErrorInUi | null | undefined => subState.error,
)
