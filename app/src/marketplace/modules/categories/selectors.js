// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { categoriesSchema } from '$shared/modules/entities/schema'
import type { CategoryList, CategoryIdList } from '../../flowtype/category-types'
import type { CategoryState, StoreState } from '../../flowtype/store-state'

const selectCategoryState = (state: StoreState): CategoryState => state.categories

export const selectCategoryIds: (StoreState) => CategoryIdList = createSelector(
    selectCategoryState,
    (subState: CategoryState): CategoryIdList => subState.ids,
)

export const selectAllCategories: (StoreState) => CategoryList = createSelector(
    selectCategoryIds,
    selectEntities,
    (result: CategoryIdList, entities: EntitiesState): CategoryList => denormalize(result, categoriesSchema, entities),
)

export const selectFetchingCategories: (StoreState) => boolean = createSelector(
    selectCategoryState,
    (subState: CategoryState): boolean => subState.fetching,
)

export const selectCategoriesError: (StoreState) => ?ErrorInUi = createSelector(
    selectCategoryState,
    (subState: CategoryState): ?ErrorInUi => subState.error,
)
