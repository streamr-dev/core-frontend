import { createSelector } from 'reselect'
import { ErrorInUi } from '$shared/types/common-types'
import { ProjectIdList } from '../../types/project-types'
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
export const selectRelatedProductListError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectRelatedProductListState,
    (subState: RelatedProductListState): ErrorInUi | null | undefined => subState.error,
)
