// @flow
import { get } from '../../utils/api'
import type { ApiResult } from '../../flowtype/common-types'
import type { Category } from '../../flowtype/category-types'

export const getCategories = (): ApiResult => get('categories')

export const getProductsByCategories = (id: $ElementType<Category, 'id'>): ApiResult => get(`categories/${id}/products`)
