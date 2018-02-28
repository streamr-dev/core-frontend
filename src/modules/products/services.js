// @flow
import { get } from '../../utils/api'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

export const getProducts = (): ApiResult => get('products')

export const getProductById = (id: ProductId): ApiResult => get(`products/${id}`)
