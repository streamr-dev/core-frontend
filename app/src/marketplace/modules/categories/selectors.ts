import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { EntitiesState } from '$shared/types/store-state'
import type { ErrorInUi } from '$shared/types/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { categoriesSchema } from '$shared/modules/entities/schema'
import type { CategoryList, CategoryIdList } from '../../types/category-types'
import type { CategoryState, StoreState } from '../../types/store-state'

const selectCategoryState = (state: StoreState): CategoryState => state.categories

export const selectCategoryIds: (arg0: StoreState) => CategoryIdList = createSelector(
    selectCategoryState,
    (subState: CategoryState): CategoryIdList => subState.ids,
)
export const selectAllCategories: (arg0: StoreState) => CategoryList = createSelector(
    selectCategoryIds,
    selectEntities,
    (result: CategoryIdList, entities: EntitiesState): CategoryList => denormalize(result, categoriesSchema, entities),
)
export const selectFetchingCategories: (arg0: StoreState) => boolean = createSelector(
    selectCategoryState,
    (subState: CategoryState): boolean => subState.fetching,
)
export const selectCategoriesError: (arg0: StoreState) => ErrorInUi | null | undefined = createSelector(
    selectCategoryState,
    (subState: CategoryState): ErrorInUi | null | undefined => subState.error,
)
