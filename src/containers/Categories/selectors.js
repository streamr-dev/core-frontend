// @flow
import { createSelector } from 'reselect'
import type { CategoryState, StoreState } from '../../flowtype/store-state'
import { values } from 'lodash'

const selectCategoryState = (state: StoreState): CategoryState => state.category

export const selectAllCategories = createSelector(
    selectCategoryState,
    (subState: CategoryState) => values(subState.byId)
)

export const selectError = createSelector(
    selectCategoryState,
    (subState: CategoryState) => subState.error
)
