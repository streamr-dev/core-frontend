// @flow

import { put } from '../../utils/api'
import { mapProductFromApi, mapProductToApi, isPaidAndNotPublishedProduct } from '../../utils/product'
import { formatApiUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { EditProduct, Product, ProductId } from '../../flowtype/product-types'

export const putProduct = (data: EditProduct, id: ProductId): ApiResult<Product> => {
    const isPaidAndNotPublished = isPaidAndNotPublishedProduct(data)

    return put(formatApiUrl('products', id), isPaidAndNotPublished ? mapProductToApi(data) : data)
        .then(mapProductFromApi)
}
