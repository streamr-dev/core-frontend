// @flow

import SetPriceDialog from '../containers/SetPriceDialog'
import ConfirmNoCoverImageDialog from '../components/ConfirmNoCoverImageDialog'

export const SET_PRICE: string = 'SET_PRICE'
export const CONFIRM_NO_COVER_IMAGE: string = 'CONFIRM_NO_COVER_IMAGE'

export default {
    [SET_PRICE]: SetPriceDialog,
    [CONFIRM_NO_COVER_IMAGE]: ConfirmNoCoverImageDialog,
}
