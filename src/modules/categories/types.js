// @flow

import type { PayloadAction, ErrorFromApi } from '../../flowtype/common-types'
import type { CategoryIdList } from '../../flowtype/category-types'

export type CategoriesAction = PayloadAction<{
    categories: CategoryIdList,
}>
export type CategoriesActionCreator = (categories: CategoryIdList) => CategoriesAction

export type CategoriesErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type CategoriesErrorActionCreator = (error: ErrorFromApi) => CategoriesErrorAction
