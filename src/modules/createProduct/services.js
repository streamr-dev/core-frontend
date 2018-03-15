// @flow

import { post } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductPreview } from '../../flowtype/product-types'

export const postProduct = (product: ProductPreview): ApiResult => post(formatUrl('products'), product)
