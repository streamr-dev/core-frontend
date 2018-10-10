// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '../../utils/url'
import { mapAllProductsFromApi } from '../../utils/product'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getMyProducts = (): ApiResult<Array<Product>> => get(formatApiUrl('users/me/products'))
    .then(mapAllProductsFromApi)

