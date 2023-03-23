import { get } from '$shared/utils/api'
import { ApiResult } from '$shared/types/common-types'
import routes from '$routes'
import { mapProductFromApi } from '../../utils/product'
import { ProjectSubscription } from '../../types/project-types'

const mapProductSubscriptions = (subscriptions: Array<ProjectSubscription>): Array<ProjectSubscription> =>
    subscriptions.map((subscription: ProjectSubscription) => ({
        ...subscription,
        product: mapProductFromApi(subscription.product),
    }))

export const getMyPurchases = (): ApiResult<Array<ProjectSubscription>> =>
    get({
        url: routes.api.subscriptions(),
    }).then(mapProductSubscriptions)
