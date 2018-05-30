// @flow

import BN from 'bignumber.js'
import { createAction } from 'redux-actions'

import type { ReduxActionCreator, ErrorInUi, NumberString } from '../../flowtype/common-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'

import {
    RESET_ALLOWANCE,
    GET_ALLOWANCE_REQUEST,
    GET_ALLOWANCE_SUCCESS,
    GET_ALLOWANCE_FAILURE,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
    SET_ALLOWANCE_FAILURE,
    RECEIVE_SET_ALLOWANCE_HASH,
} from './constants'
import type {
    AllowanceActionCreator,
    GetAllowanceErrorActionCreator,
    SetAllowanceErrorActionCreator,
    HashActionCreator,
    ReceiptActionCreator,
} from './types'
import * as services from './services'

export const resetAllowance: ReduxActionCreator = createAction(RESET_ALLOWANCE)

export const getAllowanceRequest: ReduxActionCreator = createAction(GET_ALLOWANCE_REQUEST)

export const getAllowanceSuccess: AllowanceActionCreator = createAction(
    GET_ALLOWANCE_SUCCESS,
    (allowance: NumberString) => ({
        allowance,
    }),
)

export const getAllowanceError: GetAllowanceErrorActionCreator = createAction(
    GET_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const getAllowance = () => (dispatch: Function) => {
    dispatch(getAllowanceRequest())

    return services
        .getMyAllowance()
        .then((allowance) => {
            dispatch(getAllowanceSuccess(allowance.toString()))
        }, (error: ErrorInUi) => {
            dispatch(getAllowanceError(error))
        })
}

export const setAllowanceRequest: AllowanceActionCreator = createAction(
    SET_ALLOWANCE_REQUEST,
    (allowance: NumberString) => ({
        allowance,
    }),
)

export const setAllowanceSuccess: ReceiptActionCreator = createAction(
    SET_ALLOWANCE_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    }),
)

export const receiveSetAllowanceHash: HashActionCreator = createAction(
    RECEIVE_SET_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const setAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    SET_ALLOWANCE_FAILURE,
    (error: ?ErrorInUi) => ({
        error,
    }),
)

export const setAllowance = (allowance: NumberString | BN) => (dispatch: Function) => {
    dispatch(setAllowanceRequest(allowance.toString()))

    return services
        .setMyAllowance(allowance)
        .then((tx) => (
            new Promise((resolve, reject) => {
                tx
                    .onTransactionHash((hash) => dispatch(receiveSetAllowanceHash(hash)))
                    .onTransactionComplete(resolve)
                    .onError(() => reject(new Error('Transaction aborted')))
            })
        ))
        .then((receipt) => {
            dispatch(setAllowanceSuccess(receipt))
        }, (error) => {
            dispatch(setAllowanceFailure({
                message: error.message,
            }))
        })
}
