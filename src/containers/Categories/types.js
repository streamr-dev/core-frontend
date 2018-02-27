// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {Category} from '../../flowtype/category-types'

export type CategoriesAction = PayloadAction<{
    categories: Array<Category>,
}>
export type CategoriesActionCreator = (categories: Array<Category>) => CategoriesAction

export type CategoriesErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type CategoriesErrorActionCreator = (error: ErrorFromApi) => CategoriesErrorAction
