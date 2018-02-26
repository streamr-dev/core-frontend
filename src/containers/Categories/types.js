// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {Category} from '../../flowtype/category-types'

export type CategoryIdAction = PayloadAction<{
    id: $ElementType<Category, 'id'>,
}>

export type CategoriesAction = PayloadAction<{
    categories: Array<Category>,
}>

export type CategoriesErrorAction = PayloadAction<{
    error: ErrorFromApi
}>

export type CategoryErrorAction = PayloadAction<{
    id: $ElementType<Category, 'id'>,
    error: ErrorFromApi
}>
