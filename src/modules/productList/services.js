// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

export const getProducts = (search?: ?string, category?: ?string): ApiResult => {
    return get(formatUrl('products', {
        search,
        category,
    }))
}

export const getProductById = (id: ProductId): ApiResult => get(formatUrl('products', id))
