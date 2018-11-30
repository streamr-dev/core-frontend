// @flow

import PurchaseDialog from '$mp/containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog'
import ConfirmNoCoverImageDialog from '$mp/components/Modal/ConfirmNoCoverImageDialog'
import SaveProductDialog from '$mp/containers/EditProductPage/SaveProductDialog'

export const PURCHASE = 'PURCHASE'
export const PUBLISH = 'PUBLISH'
export const CONFIRM_NO_COVER_IMAGE = 'CONFIRM_NO_COVER_IMAGE'
export const SAVE_PRODUCT = 'SAVE_PRODUCT'

export default {
    [PURCHASE]: PurchaseDialog,
    [PUBLISH]: PublishOrUnpublishDialog,
    [CONFIRM_NO_COVER_IMAGE]: ConfirmNoCoverImageDialog,
    [SAVE_PRODUCT]: SaveProductDialog,
}
