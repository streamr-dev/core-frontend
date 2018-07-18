// @flow

import BN from 'bignumber.js'
import { createAction } from 'redux-actions'
import { I18n } from '@streamr/streamr-layout'

import { purchaseFlowSteps } from '../../utils/constants'
import { selectAllowanceOrPendingAllowance } from '../allowance/selectors'
import { selectContractProduct } from '../contractProduct/selectors'
import { selectDataPerUsd } from '../global/selectors'
import { toSeconds } from '../../utils/time'
import { setAllowance as setAllowanceToContract } from '../allowance/actions'
import { buyProduct } from '../purchase/actions'
import type { NumberString, TimeUnit, ReduxActionCreator } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { StoreState, PurchaseStep } from '../../flowtype/store-state'
import type { AllowanceActionCreator } from '../allowance/types'

import { dataForTimeUnits } from '../../utils/price'
import { selectPurchaseData } from './selectors'
import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
    REPLACE_ALLOWANCE,
    RESET_REPLACED_ALLOWANCE,
} from './constants'
import type { StepActionCreator, ProductIdActionCreator, AccessPeriodActionCreator } from './types'

export const initPurchase: ProductIdActionCreator = createAction(
    INIT_PURCHASE,
    (id: ProductId) => ({
        id,
    }),
)

export const setStep: StepActionCreator = createAction(
    SET_STEP,
    (step: PurchaseStep) => ({
        step,
    }),
)

const setAccessPeriodData: AccessPeriodActionCreator = createAction(
    SET_ACCESS_PERIOD,
    (time: NumberString, timeUnit: TimeUnit) => ({
        time,
        timeUnit,
    }),
)

const setReplacedAllowance: AllowanceActionCreator = createAction(
    REPLACE_ALLOWANCE,
    (allowance: NumberString) => ({
        allowance,
    }),
)

const resetReplacedAllowance: ReduxActionCreator = createAction(RESET_REPLACED_ALLOWANCE)

export const setAccessPeriod = (time: NumberString | BN, timeUnit: TimeUnit) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(setAccessPeriodData(time.toString(), timeUnit))
    dispatch(resetReplacedAllowance())

    // Check if allowance is needed
    const state = getState()
    const product = selectContractProduct(state)

    if (!product) {
        throw new Error(I18n.t('error.noProduct'))
    }

    // Pending allowance is set if there is an ongoing transaction to set new allowance
    const allowance = BN(selectAllowanceOrPendingAllowance(state))
    const dataPerUsd = selectDataPerUsd(state)
    const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)

    if (allowance.isLessThan(price)) {
        if (allowance.isGreaterThan(0)) {
            dispatch(setStep(purchaseFlowSteps.RESET_ALLOWANCE))
        } else {
            dispatch(setStep(purchaseFlowSteps.ALLOWANCE))
        }
    } else {
        dispatch(setStep(purchaseFlowSteps.SUMMARY))
    }
}

export const setAllowance = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectContractProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error(I18n.t('error.noProductOrAccess'))
    }

    // Pending allowance is set if there is an ongoing transaction to set new allowance
    const currentAllowance = selectAllowanceOrPendingAllowance(state)
    const dataPerUsd = selectDataPerUsd(state)
    const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, purchase.time, purchase.timeUnit)

    // To update a nonzero allowance, we need to set it to zero first, and then set it to the actual value.
    // The new allowance replaces whatever old value there is. However the transaction will only succeed if the
    // old allowance is zero. If it is nonzero the tx fails. (And for this reason the buy transaction will fail too).
    // In these cases we need to make two transactions to set allowance properly.
    if (BN(currentAllowance).isGreaterThan(0)) {
        dispatch(setReplacedAllowance(price))
        dispatch(setAllowanceToContract(0, true))
    } else {
        // Start the allowance transaction, we catch the RECEIVE_SET_ALLOWANCE_HASH action from allowance
        // in the reducer and set the next step there.
        dispatch(resetReplacedAllowance())
        dispatch(setAllowanceToContract(price))
    }
}

export const approvePurchase = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectContractProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error(I18n.t('error.noProductOrAccess'))
    }

    const subscriptionTimeInSeconds = toSeconds(purchase.time, purchase.timeUnit)

    // Start the purchase transaction, we catch the RECEIVE_PURCHASE_HASH action from purchase
    // in the reducer and proceed to next step.
    dispatch(buyProduct(product.id || '', subscriptionTimeInSeconds))
}
