// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

export const getStreamByProductId = (id: ProductId): ApiResult => get(formatUrl('products', id, 'streams'))
