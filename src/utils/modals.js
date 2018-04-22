// @flow

import SetPriceDialog from '../containers/SetPriceDialog'
import PurchaseDialog from '../containers/ProductPage/PurchaseDialog'

export const SET_PRICE: string = 'SET_PRICE'
export const PURCHASE: string = 'PURCHASE'

export default {
    [SET_PRICE]: SetPriceDialog,
    [PURCHASE]: PurchaseDialog,
}
