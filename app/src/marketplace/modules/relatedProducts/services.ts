import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { mapAllProductsFromApi } from '../../utils/product'
import type { Product, ProductId } from '../../types/product-types'
export const getRelatedProducts = (id: ProductId, useAuthorization = true): ApiResult<Array<Product>> =>
    get({
        url: routes.api.products.related({
            id,
        }),
        useAuthorization,
    }).then(mapAllProductsFromApi)
