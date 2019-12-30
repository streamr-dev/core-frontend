// @flow

import { handleActions } from 'redux-actions'
import BN from 'bignumber.js'

import type { AllowanceState } from '../../flowtype/store-state'

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
import type { DataAllowanceAction, DaiAllowanceAction, HashAction, GetAllowanceErrorAction, SetAllowanceErrorAction } from './types'

export const initialState: AllowanceState = {
    dataAllowance: BN(0),
    pendingDataAllowance: null,
    gettingDataAllowance: false,
    getDataAllowanceError: null,
    settingDataAllowance: false,
    setDataAllowanceTx: null,
    setDataAllowanceError: null,
    resettingDataAllowance: false,
    resetDataAllowanceTx: null,
    resetDataAllowanceError: null,
    daiAllowance: BN(0),
    pendingDaiAllowance: null,
    gettingDaiAllowance: false,
    getDaiAllowanceError: null,
    settingDaiAllowance: false,
    setDaiAllowanceTx: null,
    setDaiAllowanceError: null,
    resettingDaiAllowance: false,
    resetDaiAllowanceTx: null,
    resetDaiAllowanceError: null,
}

const reducer: (AllowanceState) => AllowanceState = handleActions({
    // DATA Allowance
    [RESET_DATA_ALLOWANCE_STATE]: () => ({
        ...initialState,
    }),

    [GET_DATA_ALLOWANCE_REQUEST]: (state: AllowanceState) => ({
        ...state,
        gettingDataAllowance: true,
    }),

    [GET_DATA_ALLOWANCE_SUCCESS]: (state: AllowanceState, action: DataAllowanceAction) => ({
        ...state,
        gettingDataAllowance: false,
        dataAllowance: action.payload.dataAllowance,
    }),

    [GET_DATA_ALLOWANCE_FAILURE]: (state: AllowanceState, action: GetAllowanceErrorAction) => ({
        ...state,
        gettingDataAllowance: false,
        getDataAllowanceError: action.payload.error,
    }),

    [SET_DATA_ALLOWANCE_REQUEST]: (state: AllowanceState, action: DataAllowanceAction) => ({
        ...state,
        settingDataAllowance: true,
        pendingDataAllowance: action.payload.dataAllowance,
        setDataAllowanceTx: null,
        setDataAllowanceError: null,
    }),

    [RECEIVE_SET_DATA_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        setDataAllowanceTx: action.payload.hash,
    }),

    [SET_DATA_ALLOWANCE_SUCCESS]: (state: AllowanceState) => ({
        ...state,
        settingDataAllowance: false,
        dataAllowance: state.pendingDataAllowance,
        pendingDataAllowance: null,
        setDataAllowanceError: null,
    }),

    [SET_DATA_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        settingDataAllowance: false,
        pendingDataAllowance: null,
        setDataAllowanceError: action.payload.error,
    }),

    [RESET_DATA_ALLOWANCE_REQUEST]: (state: AllowanceState) => ({
        ...state,
        resettingDataAllowance: true,
        pendingDataAllowance: state.settingDataAllowance ? state.pendingDataAllowance : BN(0),
        resetDataAllowanceTx: null,
        resetDataAllowanceError: null,
    }),

    [RECEIVE_RESET_DATA_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        resetDataAllowanceTx: action.payload.hash,
    }),

    [RESET_DATA_ALLOWANCE_SUCCESS]: (state: AllowanceState) => ({
        ...state,
        resettingDataAllowance: false,
        dataAllowance: state.settingDataAllowance ? state.dataAllowance : state.pendingDataAllowance,
        pendingDataAllowance: state.settingDataAllowance ? state.pendingDataAllowance : null,
        resetDataAllowanceError: null,
    }),

    [RESET_DATA_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        resettingDataAllowance: false,
        resetDataAllowanceError: action.payload.error,
    }),

    // DAI Allowance
    [RESET_DAI_ALLOWANCE_STATE]: () => ({
        ...initialState,
    }),

    [GET_DAI_ALLOWANCE_REQUEST]: (state: AllowanceState) => ({
        ...state,
        gettingDaiAllowance: true,
    }),

    [GET_DAI_ALLOWANCE_SUCCESS]: (state: AllowanceState, action: DaiAllowanceAction) => ({
        ...state,
        gettingDaiAllowance: false,
        daiAllowance: action.payload.daiAllowance,
    }),

    [GET_DAI_ALLOWANCE_FAILURE]: (state: AllowanceState, action: GetAllowanceErrorAction) => ({
        ...state,
        gettingDaiAllowance: false,
        getDaiAllowanceError: action.payload.error,
    }),

    [SET_DAI_ALLOWANCE_REQUEST]: (state: AllowanceState, action: DaiAllowanceAction) => ({
        ...state,
        settingDaiAllowance: true,
        pendingDaiAllowance: action.payload.daiAllowance,
        setDaiAllowanceTx: null,
        setDaiAllowanceError: null,
    }),

    [RECEIVE_SET_DAI_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        setDaiAllowanceTx: action.payload.hash,
    }),

    [SET_DAI_ALLOWANCE_SUCCESS]: (state: AllowanceState) => ({
        ...state,
        settingDaiAllowance: false,
        daiAllowance: state.pendingDaiAllowance,
        pendingDaiAllowance: null,
        setDaiAllowanceError: null,
    }),

    [SET_DAI_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        settingDaiAllowance: false,
        pendingDaiAllowance: null,
        setDaiAllowanceError: action.payload.error,
    }),

    [RESET_DAI_ALLOWANCE_REQUEST]: (state: AllowanceState) => ({
        ...state,
        resettingDaiAllowance: true,
        pendingDaiAllowance: state.settingDaiAllowance ? state.pendingDaiAllowance : BN(0),
        resetDaiAllowanceTx: null,
        resetDaiAllowanceError: null,
    }),

    [RECEIVE_RESET_DAI_ALLOWANCE_HASH]: (state: AllowanceState, action: HashAction) => ({
        ...state,
        resetDaiAllowanceTx: action.payload.hash,
    }),

    [RESET_DAI_ALLOWANCE_SUCCESS]: (state: AllowanceState) => ({
        ...state,
        resettingDaiAllowance: false,
        daiAllowance: state.settingDaiAllowance ? state.daiAllowance : state.pendingDaiAllowance,
        pendingDaiAllowance: state.settingDaiAllowance ? state.pendingDaiAllowance : null,
        resetAllowanceError: null,
    }),

    [RESET_DAI_ALLOWANCE_FAILURE]: (state: AllowanceState, action: SetAllowanceErrorAction) => ({
        ...state,
        resettingDaiAllowance: false,
        resetDaiAllowanceError: action.payload.error,
    }),
}, initialState)

export default reducer
