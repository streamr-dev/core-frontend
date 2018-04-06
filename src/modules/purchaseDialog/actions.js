// @flow

import { createAction } from 'redux-actions'

import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
} from './constants'

import type { StepActionCreator, ProductIdActionCreator, AccessPeriodActionCreator } from './types'
import type { TimeUnit } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { StoreState } from '../../flowtype/store-state'
import { selectProduct, selectPurchaseData } from './selectors'
import { purchaseFlowSteps } from '../../utils/constants'
import { selectAllowance, selectPendingAllowance } from '../allowance/selectors'
import { toSeconds } from '../../utils/time'
import { setAllowance as setAllowanceToContract } from '../allowance/actions'
import { buyProduct } from '../purchase/actions'

export const initPurchase: ProductIdActionCreator = createAction(
    INIT_PURCHASE,
    (id: ProductId) => ({
        id,
    }),
)

export const setStep: StepActionCreator = createAction(
    SET_STEP,
    (step: string) => ({
        step,
    }),
)

export const setAccessPeriodData: AccessPeriodActionCreator = createAction(
    SET_ACCESS_PERIOD,
    (time: number, timeUnit: TimeUnit) => ({
        time,
        timeUnit,
    }),
)

export const setAccessPeriod = (time: number, timeUnit: TimeUnit) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(setAccessPeriodData(time, timeUnit))

    // Check if allowance is needed
    const state = getState()
    const product = selectProduct(state)

    if (!product) {
        throw new Error('Product should be defined!')
    }

    const allowance = Math.max(selectAllowance(state), selectPendingAllowance(state))
    const price = product.pricePerSecond * toSeconds(time, timeUnit)

    if (allowance < price) {
        dispatch(setStep(purchaseFlowSteps.ALLOWANCE))
    } else {
        dispatch(setStep(purchaseFlowSteps.SUMMARY))
    }
}

export const setAllowance = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error('Product and access data should be defined!')
    }

    const price = product.pricePerSecond * toSeconds(purchase.time, purchase.timeUnit)

    dispatch(setAllowanceToContract(price))
    dispatch(setStep(purchaseFlowSteps.SUMMARY))
}

export const approvePurchase = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error('Product and access data should be defined!')
    }

    const subscriptionTimeInSeconds = toSeconds(purchase.time, purchase.timeUnit)

    dispatch(buyProduct(product.id || '', subscriptionTimeInSeconds))
    dispatch(setStep(purchaseFlowSteps.COMPLETE))
}
