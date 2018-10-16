// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { mapAllProductsFromApi } from '../../utils/product'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { Product, ProductId } from '../../flowtype/product-types'

export const getRelatedProducts = (id: ProductId): ApiResult<Array<Product>> => get(formatApiUrl('products', id, 'related'))
    .then(mapAllProductsFromApi)
