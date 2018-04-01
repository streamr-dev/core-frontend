// @flow

import { handleActions } from 'redux-actions'

import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
} from './constants'
import { purchaseFlowSteps } from '../../utils/constants'
import type { ProductIdAction, AccessPeriodAction, StepAction } from './types'
import type { PurchaseDialogState } from '../../flowtype/store-state'

const initialState: PurchaseDialogState = {
    productId: '',
    step: purchaseFlowSteps.ACCESS_PERIOD,
    data: null,
}

const reducer: (PurchaseDialogState) => PurchaseDialogState = handleActions({
    [INIT_PURCHASE]: (state: PurchaseDialogState, action: ProductIdAction) => ({
        ...state,
        productId: action.payload.id,
        data: null,
    }),

    [SET_STEP]: (state: PurchaseDialogState, action: StepAction) => ({
        ...state,
        step: action.payload.step,
    }),

    [SET_ACCESS_PERIOD]: (state: PurchaseDialogState, action: AccessPeriodAction) => ({
        ...state,
        data: {
            time: action.payload.time,
            timeUnit: action.payload.timeUnit,
        }
    }),
}, initialState)

export default reducer
