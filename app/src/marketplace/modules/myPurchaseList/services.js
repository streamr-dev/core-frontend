// @flow

import { get } from '$shared/utils/api'
import { mapProductFromApi } from '../../utils/product'
import routes from '$routes'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { ProductSubscription } from '../../flowtype/product-types'

const mapProductSubscriptions = (subscriptions: Array<ProductSubscription>): Array<ProductSubscription> =>
    subscriptions.map((subscription: ProductSubscription) => ({
        ...subscription,
        product: mapProductFromApi(subscription.product),
    }))

export const getMyPurchases = (): ApiResult<Array<ProductSubscription>> => get({
    url: routes.api.subscriptions(),
})
    .then(mapProductSubscriptions)
