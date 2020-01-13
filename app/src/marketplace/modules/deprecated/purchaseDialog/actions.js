// @flow

import BN from 'bignumber.js'
import { createAction } from 'redux-actions'
import { I18n } from 'react-redux-i18n'

import { purchaseFlowSteps } from '$mp/utils/constants'
import { timeUnits, gasLimits } from '$shared/utils/constants'
import { selectDataAllowanceOrPendingDataAllowance } from '$mp/modules/allowance/selectors'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import { selectDataPerUsd } from '$mp/modules/global/selectors'
import { toSeconds } from '$mp/utils/time'
import { setDataAllowance as setAllowanceToContract, resetDataAllowance as resetAllowanceToContract } from '$mp/modules/allowance/actions'
import { buyProduct } from '$mp/modules/purchase/actions'
import NoBalanceError from '$mp/errors/NoBalanceError'
import type { NumberString, TimeUnit } from '$shared/flowtype/common-types'
import type { ProductId, SmartContractProduct } from '$mp/flowtype/product-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { PurchaseStep } from '$mp/flowtype/store-state'

import { getMyDataTokenBalance, getMyEthBalance } from '$mp/utils/web3'
import { dataForTimeUnits } from '$mp/utils/price'
import { fromAtto } from '$mp/utils/math'
import { selectPurchaseData } from './selectors'
import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
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
    (step: PurchaseStep, params: any) => ({
        step,
        params,
    }),
)

const setAccessPeriodData: AccessPeriodActionCreator = createAction(
    SET_ACCESS_PERIOD,
    (time: NumberString, timeUnit: TimeUnit) => ({
        time,
        timeUnit,
    }),
)

const getBalances = (): Promise<[BN, BN]> => {
    const ethPromise = getMyEthBalance()
    const dataPromise = getMyDataTokenBalance()

    return Promise.all([ethPromise, dataPromise])
}

export const validateDataBalanceForPurchase = async (price: BN) => {
    const [ethBalance, dataBalance] = await getBalances()

    const requiredEth = fromAtto(gasLimits.BUY_PRODUCT)

    if (ethBalance.isLessThan(requiredEth) || dataBalance.isLessThan(price)) {
        throw new NoBalanceError(
            I18n.t('error.noBalance'),
            requiredEth,
            ethBalance,
            price,
            dataBalance,
        )
    }
}

const checkBalanceForPurchase = (product: SmartContractProduct, subscriptionInSeconds: BN) =>
    (dispatch: Function, getState: () => StoreState): Promise<void> => {
        const dataPerUsd = selectDataPerUsd(getState())
        const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, subscriptionInSeconds, timeUnits.second)

        return validateDataBalanceForPurchase(price)
    }

const handleBalanceError = (error: Error, dispatch: Function) => {
    if (error instanceof NoBalanceError) {
        dispatch(setStep(purchaseFlowSteps.NO_BALANCE, {
            requiredEthBalance: error.getRequiredEthBalance(),
            currentEthBalance: error.getCurrentEthBalance(),
            requiredDataBalance: error.getRequiredDataBalance(),
            currentDataBalance: error.getCurrentDataBalance(),
        }))
    }
}

export const setAccessPeriod = (time: NumberString | BN, timeUnit: TimeUnit) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(setAccessPeriodData(time.toString(), timeUnit))

    // Check if allowance is needed
    const state = getState()
    const product = selectContractProduct(state)

    if (!product) {
        throw new Error(I18n.t('error.noProduct'))
    }

    // Pending allowance is set if there is an ongoing transaction to set new allowance
    const allowance = BN(selectDataAllowanceOrPendingDataAllowance(state))
    const dataPerUsd = selectDataPerUsd(state)
    const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, time, timeUnit)
    const subscriptionTimeInSeconds = toSeconds(time, timeUnit)

    return dispatch(checkBalanceForPurchase(product, subscriptionTimeInSeconds))
        .then(
            () => {
                if (allowance.isLessThan(price)) {
                    if (allowance.isGreaterThan(0)) {
                        dispatch(setStep(purchaseFlowSteps.RESET_DATA_ALLOWANCE))
                    } else {
                        dispatch(setStep(purchaseFlowSteps.DATA_ALLOWANCE))
                    }
                } else {
                    dispatch(setStep(purchaseFlowSteps.SUMMARY))
                }
            },
            (e) => {
                handleBalanceError(e, dispatch)
            },
        )
}

export const setAllowance = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectContractProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error(I18n.t('error.noProductOrAccess'))
    }

    const subscriptionTimeInSeconds = toSeconds(purchase.time, purchase.timeUnit)

    // Make sure we have ETH & DATA balance for the purchase
    return dispatch(checkBalanceForPurchase(product, subscriptionTimeInSeconds))
        .then(() => {
            // Pending allowance is set if there is an ongoing transaction to set new allowance
            const currentAllowance = selectDataAllowanceOrPendingDataAllowance(state)
            const dataPerUsd = selectDataPerUsd(state)
            const price = dataForTimeUnits(product.pricePerSecond, dataPerUsd, product.priceCurrency, purchase.time, purchase.timeUnit)

            if (BN(currentAllowance).isGreaterThan(0)) {
                dispatch(resetAllowanceToContract())
            } else {
                // Start the allowance transaction, we catch the RECEIVE_SET_ALLOWANCE_HASH action from allowance
                // in the reducer and set the next step there.
                dispatch(setAllowanceToContract(price.toString()))
            }
        })
        .catch((e) => {
            handleBalanceError(e, dispatch)
        })
}

export const approvePurchase = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectContractProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error(I18n.t('error.noProductOrAccess'))
    }

    const subscriptionTimeInSeconds = toSeconds(purchase.time, purchase.timeUnit)
    return dispatch(checkBalanceForPurchase(product, subscriptionTimeInSeconds))
        .then(
            () => {
                // Start the purchase transaction, we catch the RECEIVE_PURCHASE_HASH action from purchase
                // in the reducer and proceed to next step.
                dispatch(buyProduct(product.id || '', subscriptionTimeInSeconds, 'DATA', 'DONTCARE', 'DONTCARE'))
            },
            (e) => {
                handleBalanceError(e, dispatch)
            },
        )
}
