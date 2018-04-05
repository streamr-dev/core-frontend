// @flow

import { createAction } from 'redux-actions'
import {
    GET_ALLOWANCE_REQUEST,
    GET_ALLOWANCE_SUCCESS,
    GET_ALLOWANCE_FAILURE,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
    SET_ALLOWANCE_FAILURE,
    RECEIVE_SET_ALLOWANCE_HASH,
} from './constants'
import type { AllowanceActionCreator, GetAllowanceErrorActionCreator, SetAllowanceErrorActionCreator, HashActionCreator, ReceiptActionCreator } from './types'
import type { ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import * as services from './services'
import type TransactionError from '../../errors/TransactionError'

export const getAllowanceRequest: ReduxActionCreator = createAction(GET_ALLOWANCE_REQUEST)

export const getAllowanceSuccess: AllowanceActionCreator = createAction(
    GET_ALLOWANCE_SUCCESS,
    (allowance: number) => ({
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
        .then((allowance: number) => dispatch(getAllowanceSuccess(allowance)))
        .catch((error: ErrorInUi) => dispatch(getAllowanceError(error)))
}

export const setAllowanceRequest: AllowanceActionCreator = createAction(
    SET_ALLOWANCE_REQUEST,
    (allowance: number) => ({
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
    (error: TransactionError) => ({
        error,
    }),
)

export const setAllowance = (allowance: number) => (dispatch: Function) => {
    dispatch(setAllowanceRequest(allowance))

    return services
        .setMyAllowance(allowance)
        .onTransactionHash((hash) => dispatch(receiveSetAllowanceHash(hash)))
        .onTransactionComplete((receipt) => dispatch(setAllowanceSuccess(receipt)))
        .onError((error) => dispatch(setAllowanceFailure(error)))
}
