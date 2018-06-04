// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product, ProductId } from '../../flowtype/product-types'

export const getRelatedProducts = (id: ProductId): ApiResult<Array<Product>> => get(formatApiUrl('products', id, 'related'))
