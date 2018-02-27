// @flow
import { get } from '../../utils/api'
import type { ApiResult } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getProducts = (): ApiResult => get('products')

export const getProductById = (id: $ElementType<Product, 'id'>): ApiResult => get(`products/${id}`)
