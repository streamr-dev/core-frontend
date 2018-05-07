// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Filter, ProductList } from '../../flowtype/product-types'
import { mapProductFromApi } from '../../utils/product'

export const getProducts = (filter: Filter, pageSize: number, offset: number): ApiResult<ProductList> => get(formatApiUrl('products', {
    ...filter,
    publicAccess: true,
    grantedAccess: false,
    max: pageSize,
    offset,
}))
    .then((products) => products.map(mapProductFromApi))
