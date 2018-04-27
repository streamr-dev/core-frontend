// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getMyProducts = (): ApiResult<Array<Product>> => get(formatUrl('users/me/products'))
