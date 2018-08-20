// @flow

import { handleActions } from 'redux-actions'
import BN from 'bignumber.js'

import { transactionStates } from '../../utils/constants'
import type { AllowanceState } from '../../flowtype/store-state'

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
import type { AllowanceAction, HashAction, ReceiptAction, GetAllowanceErrorAction, SetAllowanceErrorAction } from './types'

export const initialState: AllowanceState = {
    hash: null,
    allowance: BN(0),
    pendingAllowance: null,
    gettingAllowance: false,
    settingAllowance: false,
    receipt: null,
    error: null,
    transactionState: null,
}

const reducer: (AllowanceState) => AllowanceState = handleActions({
    [RESET_ALLOWANCE]: () => ({
        ...initialState,
    }),

    [GET_ALLOWANCE_REQUEST]: (state: AllowanceState) => ({
        ...state,
        gettingAllowance: true,
    }),

    [GET_ALLOWANCE_SUCCESS]: (state: AllowanceState, action: AllowanceAction) => ({
        ...state,
        gettingAllowance: false,
        allowance: action.payload.allowance,
    }),

    [GET_ALLOWANCE_FAILURE]: (state: AllowanceState, action: GetAllowanceErrorAction) => ({
        ...state,
        gettingAllowance: false,
        error: action.payload.error,
    }),

    [SET_ALLOWANCE_REQUEST]: (state: AllowanceState, action: AllowanceAction) => ({
        ...state,
        hash: null,
        receipt: null,
        settingAllowance: true,
        pendingAllowance: action.payload.allowance,
        transactionState: transactionStates.STARTED,
    }),

    [RECEIVE_SET_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        hash: action.payload.hash,
        transactionState: transactionStates.PENDING,
    }),

    [SET_ALLOWANCE_SUCCESS]: (state: AllowanceState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        settingAllowance: false,
        allowance: state.pendingAllowance,
        pendingAllowance: null,
        transactionState: transactionStates.CONFIRMED,
    }),

    [SET_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        error: action.payload.error,
        settingAllowance: false,
        pendingAllowance: null,
        transactionState: transactionStates.FAILED,
    }),
}, initialState)

export default reducer
