// @flow

import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import routes from '$routes'
import { mapAllProductsFromApi } from '../../utils/product'

import type { Product, ProductId } from '../../flowtype/product-types'

export const getRelatedProducts = (id: ProductId, useAuthorization: boolean = true): ApiResult<Array<Product>> => get({
    url: routes.api.products.related({
        id,
    }),
    useAuthorization,
})
    .then(mapAllProductsFromApi)
