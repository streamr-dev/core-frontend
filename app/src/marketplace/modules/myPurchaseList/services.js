// @flow

import { get } from '../../utils/api'
import { formatApiUrl } from '../../utils/url'
import { mapProductFromApi } from '../../utils/product'

import type { ApiResult } from '../../flowtype/common-types'
import type { ProductSubscription } from '../../flowtype/product-types'

const mapProductSubscriptions = (subscriptions: Array<ProductSubscription>): Array<ProductSubscription> =>
    subscriptions.map((subscription: ProductSubscription) => ({
        ...subscription,
        product: mapProductFromApi(subscription.product),
    }))

export const getMyPurchases = (): ApiResult<Array<ProductSubscription>> => get(formatApiUrl('subscriptions'))
    .then(mapProductSubscriptions)
