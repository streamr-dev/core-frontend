// @flow

import { handleActions } from 'redux-actions'
import BN from 'bignumber.js'

import type { AllowanceState } from '../../flowtype/store-state'

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
import type { AllowanceAction, HashAction, GetAllowanceErrorAction, SetAllowanceErrorAction } from './types'

export const initialState: AllowanceState = {
    allowance: BN(0),
    pendingAllowance: null,
    gettingAllowance: false,
    getAllowanceError: null,
    settingAllowance: false,
    setAllowanceTx: null,
    setAllowanceError: null,
    resettingAllowance: false,
    resetAllowanceTx: null,
    resetAllowanceError: null,
}

const reducer: (AllowanceState) => AllowanceState = handleActions({
    [RESET_ALLOWANCE_STATE]: () => ({
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
        getAllowanceError: action.payload.error,
    }),

    [SET_ALLOWANCE_REQUEST]: (state: AllowanceState, action: AllowanceAction) => ({
        ...state,
        settingAllowance: true,
        pendingAllowance: action.payload.allowance,
        setAllowanceTx: null,
        setAllowanceError: null,
    }),

    [RECEIVE_SET_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        setAllowanceTx: action.payload.hash,
    }),

    [SET_ALLOWANCE_SUCCESS]: (state: AllowanceState) => ({
        ...state,
        settingAllowance: false,
        allowance: state.pendingAllowance,
        pendingAllowance: null,
        setAllowanceError: null,
    }),

    [SET_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        settingAllowance: false,
        pendingAllowance: null,
        setAllowanceError: action.payload.error,
    }),

    [RESET_ALLOWANCE_REQUEST]: (state: AllowanceState) => ({
        ...state,
        resettingAllowance: true,
        pendingAllowance: state.settingAllowance ? state.pendingAllowance : BN(0),
        resetAllowanceTx: null,
        resetAllowanceError: null,
    }),

    [RECEIVE_RESET_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        resetAllowanceTx: action.payload.hash,
    }),

    [RESET_ALLOWANCE_SUCCESS]: (state: AllowanceState) => ({
        ...state,
        resettingAllowance: false,
        allowance: state.settingAllowance ? state.allowance : state.pendingAllowance,
        pendingAllowance: state.settingAllowance ? state.pendingAllowance : null,
        resetAllowanceError: null,
    }),

    [RESET_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        resettingAllowance: false,
        resetAllowanceError: action.payload.error,
    }),
}, initialState)

export default reducer
