// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {Category} from '../../flowtype/category-types'
import type {Product} from '../../flowtype/product-types'

export type CategoryIdAction = PayloadAction<{
    id: $ElementType<Category, 'id'>,
}>
export type CategoryIdActionCreator = (id: $ElementType<Category, 'id'>) => CategoryIdAction

export type CategoriesAction = PayloadAction<{
    categories: Array<Category>,
}>
export type CategoriesActionCreator = (categories: Array<Category>) => CategoriesAction

export type ProductsByCategoryAction = PayloadAction<{
    id: $ElementType<Category, 'id'>,
    products: Array<Product>,
}>
export type ProductsByCategoryActionCreator = (id: $ElementType<Category, 'id'>, products: Array<Product>) => ProductsByCategoryAction

export type CategoriesErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type CategoriesErrorActionCreator = (error: ErrorFromApi) => CategoriesErrorAction

export type CategoryErrorAction = PayloadAction<{
    id: $ElementType<Category, 'id'>,
    error: ErrorFromApi
}>
export type CategoryErrorActionCreator = (id: $ElementType<Category, 'id'>, error: ErrorFromApi) => CategoryErrorAction
