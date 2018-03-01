// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { CategoryState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { CategoryList, CategoryIdList } from '../../flowtype/category-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { selectEntities } from '../../modules/entities/selectors'
import { categoriesSchema } from '../../modules/entities/schema'

const selectCategoryState = (state: StoreState): CategoryState => state.categories

export const selectCategoryIds: (StoreState) => CategoryIdList = createSelector(
    selectCategoryState,
    (subState: CategoryState): CategoryIdList => subState.ids
)

export const selectAllCategories: (StoreState) => CategoryList = createSelector(
    selectCategoryIds,
    selectEntities,
    (result: CategoryIdList, entities: EntitiesState): CategoryList => denormalize(result, categoriesSchema, entities)
)

export const selectFetchingCategories: (StoreState) => boolean = createSelector(
    selectCategoryState,
    (subState: CategoryState): boolean => subState.fetching
)

export const selectError: (StoreState) => ?ErrorInUi = createSelector(
    selectCategoryState,
    (subState: CategoryState): ?ErrorInUi => subState.error
)
