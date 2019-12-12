// @flow

import BN from 'bignumber.js'
import { createAction } from 'redux-actions'
import { I18n } from 'react-redux-i18n'

import type { NumberString, ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { Hash } from '$shared/flowtype/web3-types'
import { addTransaction } from '../transactions/actions'
import { transactionTypes } from '$shared/utils/constants'

import {
    RESET_ALLOWANCE_STATE,
    GET_ALLOWANCE_REQUEST,
    GET_ALLOWANCE_SUCCESS,
    GET_ALLOWANCE_FAILURE,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
    SET_ALLOWANCE_FAILURE,
    RECEIVE_SET_ALLOWANCE_HASH,
    RESET_ALLOWANCE_REQUEST,
    RESET_ALLOWANCE_SUCCESS,
    RESET_ALLOWANCE_FAILURE,
    RECEIVE_RESET_ALLOWANCE_HASH,
} from './constants'
import type {
    AllowanceActionCreator,
    GetAllowanceErrorActionCreator,
    HashActionCreator,
    SetAllowanceErrorActionCreator,
} from './types'
import * as services from './services'

export const resetAllowanceState: ReduxActionCreator = createAction(RESET_ALLOWANCE_STATE)

const getAllowanceRequest: ReduxActionCreator = createAction(GET_ALLOWANCE_REQUEST)

const getAllowanceSuccess: AllowanceActionCreator = createAction(
    GET_ALLOWANCE_SUCCESS,
    (allowance: NumberString) => ({
        allowance,
    }),
)

const getAllowanceError: GetAllowanceErrorActionCreator = createAction(
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

const setAllowanceRequest: AllowanceActionCreator = createAction(
    SET_ALLOWANCE_REQUEST,
    (allowance: NumberString) => ({
        allowance,
    }),
)
const setAllowanceSuccess: ReduxActionCreator = createAction(SET_ALLOWANCE_SUCCESS)
const setAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    SET_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)
const receiveSetAllowanceHash: HashActionCreator = createAction(
    RECEIVE_SET_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const resetAllowanceRequest: ReduxActionCreator = createAction(RESET_ALLOWANCE_REQUEST)
const resetAllowanceSuccess: ReduxActionCreator = createAction(RESET_ALLOWANCE_SUCCESS)
const resetAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    RESET_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

const receiveResetAllowanceHash: HashActionCreator = createAction(
    RECEIVE_RESET_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const setAllowance = (allowance: NumberString | BN) => (dispatch: Function) => {
    dispatch(setAllowanceRequest(allowance.toString()))
    let tx

    try {
        tx = services.setMyAllowance(allowance)
    } catch (err) {
        return dispatch(setAllowanceFailure({
            message: err.message,
        }))
    }

    const txPromise = new Promise((resolve, reject) => {
        tx
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.SET_ALLOWANCE))
                dispatch(receiveSetAllowanceHash(hash))
            })
            .onTransactionComplete(resolve)
            .onError(() => reject(new Error(I18n.t('error.txAborted'))))
    })

    return txPromise
        .then(() => {
            dispatch(setAllowanceSuccess())
        }, (error) => {
            dispatch(setAllowanceFailure({
                message: error.message,
            }))
        })
}

export const resetAllowance = () => (dispatch: Function) => {
    dispatch(resetAllowanceRequest())
    let tx

    try {
        tx = services.setMyAllowance('0')
    } catch (err) {
        return dispatch(resetAllowanceFailure({
            message: err.message,
        }))
    }

    const txPromise = new Promise((resolve, reject) => {
        tx
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.RESET_ALLOWANCE))
                dispatch(receiveResetAllowanceHash(hash))
            })
            .onTransactionComplete(resolve)
            .onError(() => reject(new Error(I18n.t('error.txAborted'))))
    })

    return txPromise
        .then(() => {
            dispatch(resetAllowanceSuccess())
        }, (error) => {
            dispatch(resetAllowanceFailure({
                message: error.message,
            }))
        })
}
