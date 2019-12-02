// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { mapAllProductsFromApi } from '../../utils/product'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { Product, ProductId } from '../../flowtype/product-types'

export const getRelatedProducts = (id: ProductId, useAuthorization: boolean = true): ApiResult<Array<Product>> => get({
    url: formatApiUrl('products', id, 'related'),
    useAuthorization,
})
    .then(mapAllProductsFromApi)
