// @flow

import SetPriceDialog from '../containers/SetPriceDialog'
import PurchaseDialog from '../containers/ProductPage/PurchaseDialog'
import PublishOrUnpublishDialog from '../containers/ProductPage/PublishOrUnpublishDialog'

export const SET_PRICE: string = 'SET_PRICE'
export const PURCHASE: string = 'PURCHASE'
export const PUBLISH: string = 'PUBLISH'

export default {
    [SET_PRICE]: SetPriceDialog,
    [PURCHASE]: PurchaseDialog,
    [PUBLISH]: PublishOrUnpublishDialog,
}
