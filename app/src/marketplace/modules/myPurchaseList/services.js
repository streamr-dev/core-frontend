// @flow

import { get } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import { mapProductFromApi } from '../../utils/product'

import type { ApiResult } from '$shared/flowtype/common-types'
import type { ProductSubscription } from '../../flowtype/product-types'

const mapProductSubscriptions = (subscriptions: Array<ProductSubscription>): Array<ProductSubscription> =>
    subscriptions.map((subscription: ProductSubscription) => ({
        ...subscription,
        product: mapProductFromApi(subscription.product),
    }))

export const getMyPurchases = (): ApiResult<Array<ProductSubscription>> => get({
    url: formatApiUrl('subscriptions'),
})
    .then(mapProductSubscriptions)
