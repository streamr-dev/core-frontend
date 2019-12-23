// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { mapAllProductsFromApi } from '../../utils/product'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getMyProducts = (params: any): ApiResult<Array<Product>> => get({
    url: formatApiUrl('users/me/products'),
    options: {
        params,
    },
})
    .then(mapAllProductsFromApi)
