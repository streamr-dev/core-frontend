// @flow

import PurchaseDialog from '$mp/containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog'
import SaveProductDialog from '$mp/containers/EditProductPage/SaveProductDialog'

export const PURCHASE = 'PURCHASE'
export const PUBLISH = 'PUBLISH'
export const SAVE_PRODUCT = 'SAVE_PRODUCT'

export default {
    [PURCHASE]: PurchaseDialog,
    [PUBLISH]: PublishOrUnpublishDialog,
    [SAVE_PRODUCT]: SaveProductDialog,
}
