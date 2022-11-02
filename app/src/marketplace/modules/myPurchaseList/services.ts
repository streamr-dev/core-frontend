import { get } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { mapProductFromApi } from '../../utils/product'
import type { ProductSubscription } from '../../types/product-types'

const mapProductSubscriptions = (subscriptions: Array<ProductSubscription>): Array<ProductSubscription> =>
    subscriptions.map((subscription: ProductSubscription) => ({
        ...subscription,
        product: mapProductFromApi(subscription.product),
    }))

export const getMyPurchases = (): ApiResult<Array<ProductSubscription>> =>
    get({
        url: routes.api.subscriptions(),
    }).then(mapProductSubscriptions)
