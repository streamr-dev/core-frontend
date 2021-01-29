// @flow

import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import routes from '$routes'
import { mapAllProductsFromApi } from '../../utils/product'

import type { Product } from '../../flowtype/product-types'

export const getMyProducts = (params: any): ApiResult<Array<Product>> => get({
    url: routes.api.currentUser.products(),
    options: {
        params,
    },
})
    .then(mapAllProductsFromApi)
