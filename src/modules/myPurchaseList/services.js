// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getMyPurchases = (): ApiResult<Array<Product>> => get(formatUrl('subscriptions'))
    .then((subscriptions) => subscriptions.map((subscription) => subscription.product))
