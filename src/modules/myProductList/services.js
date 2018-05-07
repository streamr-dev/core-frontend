// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getMyProducts = (): ApiResult<Array<Product>> => get(formatApiUrl('users/me/products'))
