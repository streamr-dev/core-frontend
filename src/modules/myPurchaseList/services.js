// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'

import type { ApiResult } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

export const getMyPurchases = (): ApiResult<Array<Product>> => get(formatApiUrl('subscriptions'))
    .then((subscriptions) => subscriptions.map((subscription) => ({
        ...subscription.product,
        endTimestamp: subscription.endsAt,
    })))
