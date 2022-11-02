import type { ErrorFromApi, PayloadAction } from '$shared/types/common-types'
import type { CategoryIdList } from '../../types/category-types'
export type CategoriesAction = PayloadAction<{
    categories: CategoryIdList
}>
export type CategoriesActionCreator = (categories: CategoryIdList) => CategoriesAction
export type CategoriesErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type CategoriesErrorActionCreator = (error: ErrorFromApi) => CategoriesErrorAction
