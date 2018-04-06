// @flow

import { put } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { EditProduct, ProductId } from '../../flowtype/product-types'

export const putProduct = (data: EditProduct, id: ProductId): ApiResult => put(formatUrl('products', id), data)
