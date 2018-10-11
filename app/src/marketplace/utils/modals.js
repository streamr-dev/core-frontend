// @flow

import SetPriceDialog from '$mp/containers/ProductPage/PurchaseDialog/SetPriceDialog'
import PurchaseDialog from '$mp/containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '$mp/containers/ProductPage/PublishOrUnpublishDialog'
import ConfirmNoCoverImageDialog from '$mp/components/Modal/ConfirmNoCoverImageDialog'
import StreamLiveDataDialog from '$mp/containers/ProductPage/StreamLiveDataDialog'
import SaveProductDialog from '$mp/containers/EditProductPage/SaveProductDialog'

export const SET_PRICE = 'SET_PRICE'
export const PURCHASE = 'PURCHASE'
export const PUBLISH = 'PUBLISH'
export const CONFIRM_NO_COVER_IMAGE = 'CONFIRM_NO_COVER_IMAGE'
export const STREAM_LIVE_DATA = 'STREAM_LIVE_DATA'
export const SAVE_PRODUCT = 'SAVE_PRODUCT'

export default {
    [SET_PRICE]: SetPriceDialog,
    [PURCHASE]: PurchaseDialog,
    [PUBLISH]: PublishOrUnpublishDialog,
    [STREAM_LIVE_DATA]: StreamLiveDataDialog,
    [CONFIRM_NO_COVER_IMAGE]: ConfirmNoCoverImageDialog,
    [SAVE_PRODUCT]: SaveProductDialog,
}
