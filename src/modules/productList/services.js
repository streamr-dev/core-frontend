// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId, Filter, Product } from '../../flowtype/product-types'

export const getProducts = (filter: Filter): ApiResult<Array<Product>> => get(formatUrl('products', filter))

export const getProductById = (id: ProductId): ApiResult => get(formatUrl('products', id))
