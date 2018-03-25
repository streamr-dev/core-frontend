// @flow

import { createAction } from 'redux-actions'

import {
    INIT_PURCHASE,
    SET_ACCESS_PERIOD,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
    SET_ALLOWANCE_ERROR,
    APPROVE_PAYMENT_REQUEST,
    APPROVE_PAYMENT_SUCCESS,
    APPROVE_PAYMENT_ERROR,
    SEND_TRANSACTION_REQUEST,
    SEND_TRANSACTION_SUCCESS,
    SEND_TRANSACTION_ERROR,
} from './constants'
import * as services from './services'

import type { ProductIdActionCreator, AccessPeriodActionCreator } from './types'
import type { ReduxActionCreator, PriceUnit } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

export const initPurchase: ProductIdActionCreator = createAction(
    INIT_PURCHASE,
    (id: ProductId) => ({
        id,
    })
)

export const setAccessPeriod: AccessPeriodActionCreator = createAction(
    SET_ACCESS_PERIOD,
    (time: number, timeUnit: PriceUnit) => ({
        time,
        timeUnit,
    }),
)

export const setAllowanceRequest: ReduxActionCreator = createAction(
    SET_ALLOWANCE_REQUEST
)

export const setAllowanceSuccess: ReduxActionCreator = createAction(
    SET_ALLOWANCE_SUCCESS
)

export const setAllowanceError: ReduxActionCreator = createAction(
    SET_ALLOWANCE_ERROR
)

export const approvePaymentRequest: ReduxActionCreator = createAction(
    APPROVE_PAYMENT_REQUEST
)

export const approvePaymentSuccess: ReduxActionCreator = createAction(
    APPROVE_PAYMENT_SUCCESS
)

export const approvePaymentError: ReduxActionCreator = createAction(
    APPROVE_PAYMENT_ERROR
)

export const sendTransactionRequest: ReduxActionCreator = createAction(
    SEND_TRANSACTION_REQUEST
)

export const sendTransactionSuccess: ReduxActionCreator = createAction(
    SEND_TRANSACTION_SUCCESS
)

export const sendTransactionError: ReduxActionCreator = createAction(
    SEND_TRANSACTION_ERROR
)

export const setAllowance = () => (dispatch: Function) => {
    dispatch(setAllowanceRequest())

    return services.setAllowance()
        .then(() => dispatch(setAllowanceSuccess()))
        .catch(() => dispatch(setAllowanceError()))
}

export const approvePurchase = () => (dispatch: Function) => {
    dispatch(approvePaymentRequest())

    return services.approvePayment()
        .then(() => {
            dispatch(approvePaymentSuccess())
            dispatch(sendTransactionRequest())

            services.startTransaction()
                .then(() => dispatch(sendTransactionSuccess()))
                .catch()
        })
        .catch(() => dispatch(dispatch(approvePaymentError())))
}
