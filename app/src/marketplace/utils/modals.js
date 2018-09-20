// @flow

import SetPriceDialog from '../containers/ProductPage/PurchaseDialog/SetPriceDialog'
import PurchaseDialog from '../containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '../containers/ProductPage/PublishOrUnpublishDialog'
import ConfirmNoCoverImageDialog from '../components/Modal/ConfirmNoCoverImageDialog'
import StreamLiveDataDialog from '../containers/ProductPage/StreamLiveDataDialog'
import SaveProductDialog from '../containers/EditProductPage/SaveProductDialog'

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
