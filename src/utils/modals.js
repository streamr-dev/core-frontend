// @flow

import SetPriceDialog from '../containers/SetPriceDialog'
import PurchaseDialog from '../containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '../containers/ProductPage/PublishOrUnpublishDialog'
import ConfirmNoCoverImageDialog from '../components/Modal/ConfirmNoCoverImageDialog'
import SaveProductDialog from '../containers/EditProductPage/SaveProductDialog'

export const SET_PRICE: string = 'SET_PRICE'
export const PURCHASE: string = 'PURCHASE'
export const PUBLISH: string = 'PUBLISH'
export const CONFIRM_NO_COVER_IMAGE: string = 'CONFIRM_NO_COVER_IMAGE'
export const SAVE_PRODUCT: string = 'SAVE_PRODUCT'

export default {
    [SET_PRICE]: SetPriceDialog,
    [PURCHASE]: PurchaseDialog,
    [PUBLISH]: PublishOrUnpublishDialog,
    [CONFIRM_NO_COVER_IMAGE]: ConfirmNoCoverImageDialog,
    [SAVE_PRODUCT]: SaveProductDialog,
}
