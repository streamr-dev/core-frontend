// @flow

import { put } from '../../utils/api'
import { mapProductFromApi, mapProductToApi } from '../../utils/product'
import { formatApiUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { EditProduct, Product, ProductId } from '../../flowtype/product-types'

export const putProductWithPrice = (data: EditProduct, id: ProductId): ApiResult<Product> => put(formatApiUrl('products', id), mapProductToApi(data))
    .then(mapProductFromApi)

export const putProductWithoutPrice = (data: EditProduct, id: ProductId): ApiResult<Product> => put(formatApiUrl('products', id), data)
    .then(mapProductFromApi)
