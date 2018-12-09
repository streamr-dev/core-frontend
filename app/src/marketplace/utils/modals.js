// @flow

import PurchaseDialog from '$mp/containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog'

export const PURCHASE = 'PURCHASE'
export const PUBLISH = 'PUBLISH'

export default {
    [PURCHASE]: PurchaseDialog,
    [PUBLISH]: PublishOrUnpublishDialog,
}
