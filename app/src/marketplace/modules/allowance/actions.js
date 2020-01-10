// @flow

import BN from 'bignumber.js'
import { createAction } from 'redux-actions'
import { I18n } from 'react-redux-i18n'

import type { NumberString, ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { Hash } from '$shared/flowtype/web3-types'
import { addTransaction } from '../transactions/actions'
import { transactionTypes } from '$shared/utils/constants'

import {
    RESET_DATA_ALLOWANCE_STATE,
    GET_DATA_ALLOWANCE_REQUEST,
    GET_DATA_ALLOWANCE_SUCCESS,
    GET_DATA_ALLOWANCE_FAILURE,
    SET_DATA_ALLOWANCE_REQUEST,
    SET_DATA_ALLOWANCE_SUCCESS,
    SET_DATA_ALLOWANCE_FAILURE,
    RECEIVE_SET_DATA_ALLOWANCE_HASH,
    RESET_DATA_ALLOWANCE_REQUEST,
    RESET_DATA_ALLOWANCE_SUCCESS,
    RESET_DATA_ALLOWANCE_FAILURE,
    RECEIVE_RESET_DATA_ALLOWANCE_HASH,
    RESET_DAI_ALLOWANCE_STATE,
    GET_DAI_ALLOWANCE_REQUEST,
    GET_DAI_ALLOWANCE_SUCCESS,
    GET_DAI_ALLOWANCE_FAILURE,
    SET_DAI_ALLOWANCE_REQUEST,
    SET_DAI_ALLOWANCE_SUCCESS,
    SET_DAI_ALLOWANCE_FAILURE,
    RECEIVE_SET_DAI_ALLOWANCE_HASH,
    RESET_DAI_ALLOWANCE_REQUEST,
    RESET_DAI_ALLOWANCE_SUCCESS,
    RESET_DAI_ALLOWANCE_FAILURE,
    RECEIVE_RESET_DAI_ALLOWANCE_HASH,
} from './constants'
import type {
    AllowanceActionCreator,
    GetAllowanceErrorActionCreator,
    HashActionCreator,
    SetAllowanceErrorActionCreator,
} from './types'
import * as services from './services'

// DATA Allowance methods

export const resetDataAllowanceState: ReduxActionCreator = createAction(RESET_DATA_ALLOWANCE_STATE)

const getDataAllowanceRequest: ReduxActionCreator = createAction(GET_DATA_ALLOWANCE_REQUEST)

const getDataAllowanceSuccess: AllowanceActionCreator = createAction(
    GET_DATA_ALLOWANCE_SUCCESS,
    (dataAllowance: NumberString) => ({
        dataAllowance,
    }),
)

const getDataAllowanceError: GetAllowanceErrorActionCreator = createAction(
    GET_DATA_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const getDataAllowance = () => (dispatch: Function) => {
    dispatch(getDataAllowanceRequest())

    return services
        .getMyDataAllowance()
        .then((allowance) => {
            dispatch(getDataAllowanceSuccess(allowance.toString()))
        }, (error: ErrorInUi) => {
            dispatch(getDataAllowanceError(error))
        })
}

const setDataAllowanceRequest: AllowanceActionCreator = createAction(
    SET_DATA_ALLOWANCE_REQUEST,
    (dataAllowance: NumberString) => ({
        dataAllowance,
    }),
)
const setDataAllowanceSuccess: ReduxActionCreator = createAction(SET_DATA_ALLOWANCE_SUCCESS)
const setDataAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    SET_DATA_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)
const receiveSetDataAllowanceHash: HashActionCreator = createAction(
    RECEIVE_SET_DATA_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const resetDataAllowanceRequest: ReduxActionCreator = createAction(RESET_DATA_ALLOWANCE_REQUEST)
const resetDataAllowanceSuccess: ReduxActionCreator = createAction(RESET_DATA_ALLOWANCE_SUCCESS)
const resetDataAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    RESET_DATA_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

const receiveResetDataAllowanceHash: HashActionCreator = createAction(
    RECEIVE_RESET_DATA_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const setDataAllowance = (allowance: NumberString | BN) => (dispatch: Function) => {
    dispatch(setDataAllowanceRequest(allowance.toString()))
    let tx

    try {
        tx = services.setMyDataAllowance(allowance)
    } catch (err) {
        return dispatch(setDataAllowanceFailure({
            message: err.message,
        }))
    }

    const txPromise = new Promise((resolve, reject) => {
        tx
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.SET_DATA_ALLOWANCE))
                dispatch(receiveSetDataAllowanceHash(hash))
            })
            .onTransactionComplete(resolve)
            .onError(() => reject(new Error(I18n.t('error.txAborted'))))
    })

    return txPromise
        .then(() => {
            dispatch(setDataAllowanceSuccess())
        }, (error) => {
            dispatch(setDataAllowanceFailure({
                message: error.message,
            }))
        })
}

export const resetDataAllowance = () => (dispatch: Function) => {
    dispatch(resetDataAllowanceRequest())
    let tx

    try {
        tx = services.setMyDataAllowance('0')
    } catch (err) {
        return dispatch(resetDataAllowanceFailure({
            message: err.message,
        }))
    }

    const txPromise = new Promise((resolve, reject) => {
        tx
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.RESET_DATA_ALLOWANCE))
                dispatch(receiveResetDataAllowanceHash(hash))
            })
            .onTransactionComplete(resolve)
            .onError(() => reject(new Error(I18n.t('error.txAborted'))))
    })

    return txPromise
        .then(() => {
            dispatch(resetDataAllowanceSuccess())
        }, (error) => {
            dispatch(resetDataAllowanceFailure({
                message: error.message,
            }))
        })
}

// DAI Allowance methods

export const resetDaiAllowanceState: ReduxActionCreator = createAction(RESET_DAI_ALLOWANCE_STATE)

const getDaiAllowanceRequest: ReduxActionCreator = createAction(GET_DAI_ALLOWANCE_REQUEST)

const getDaiAllowanceSuccess: AllowanceActionCreator = createAction(
    GET_DAI_ALLOWANCE_SUCCESS,
    (daiAllowance: NumberString) => ({
        daiAllowance,
    }),
)

const getDaiAllowanceError: GetAllowanceErrorActionCreator = createAction(
    GET_DAI_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const getDaiAllowance = () => (dispatch: Function) => {
    dispatch(getDaiAllowanceRequest())

    return services
        .getMyDaiAllowance()
        .then((allowance) => {
            dispatch(getDaiAllowanceSuccess(allowance.toString()))
        }, (error: ErrorInUi) => {
            dispatch(getDaiAllowanceError(error))
        })
}

const setDaiAllowanceRequest: AllowanceActionCreator = createAction(
    SET_DAI_ALLOWANCE_REQUEST,
    (daiAllowance: NumberString) => ({
        daiAllowance,
    }),
)
const setDaiAllowanceSuccess: ReduxActionCreator = createAction(SET_DAI_ALLOWANCE_SUCCESS)
const setDaiAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    SET_DAI_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)
const receiveSetDaiAllowanceHash: HashActionCreator = createAction(
    RECEIVE_SET_DAI_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const resetDaiAllowanceRequest: ReduxActionCreator = createAction(RESET_DAI_ALLOWANCE_REQUEST)
const resetDaiAllowanceSuccess: ReduxActionCreator = createAction(RESET_DAI_ALLOWANCE_SUCCESS)
const resetDaiAllowanceFailure: SetAllowanceErrorActionCreator = createAction(
    RESET_DAI_ALLOWANCE_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

const receiveResetDaiAllowanceHash: HashActionCreator = createAction(
    RECEIVE_RESET_DAI_ALLOWANCE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const setDaiAllowance = (allowance: NumberString | BN) => (dispatch: Function) => {
    dispatch(setDaiAllowanceRequest(allowance.toString()))
    let tx

    try {
        tx = services.setMyDaiAllowance(allowance)
    } catch (err) {
        return dispatch(setDaiAllowanceFailure({
            message: err.message,
        }))
    }

    const txPromise = new Promise((resolve, reject) => {
        tx
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.SET_DAI_ALLOWANCE))
                dispatch(receiveSetDaiAllowanceHash(hash))
            })
            .onTransactionComplete(resolve)
            .onError(() => reject(new Error(I18n.t('error.txAborted'))))
    })

    return txPromise
        .then(() => {
            dispatch(setDaiAllowanceSuccess())
        }, (error) => {
            dispatch(setDaiAllowanceFailure({
                message: error.message,
            }))
        })
}

export const resetDaiAllowance = () => (dispatch: Function) => {
    dispatch(resetDaiAllowanceRequest())
    let tx

    try {
        tx = services.setMyDaiAllowance('0')
    } catch (err) {
        return dispatch(resetDaiAllowanceFailure({
            message: err.message,
        }))
    }

    const txPromise = new Promise((resolve, reject) => {
        tx
            .onTransactionHash((hash) => {
                dispatch(addTransaction(hash, transactionTypes.RESET_DAI_ALLOWANCE))
                dispatch(receiveResetDaiAllowanceHash(hash))
            })
            .onTransactionComplete(resolve)
            .onError(() => reject(new Error(I18n.t('error.txAborted'))))
    })

    return txPromise
        .then(() => {
            dispatch(resetDaiAllowanceSuccess())
        }, (error) => {
            dispatch(resetDaiAllowanceFailure({
                message: error.message,
            }))
        })
}
