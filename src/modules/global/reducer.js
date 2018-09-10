// @flow

import { handleActions } from 'redux-actions'

import type { GlobalState } from '../../flowtype/store-state'

import {
    GET_DATA_USD_RATE_REQUEST,
    GET_DATA_USD_RATE_SUCCESS,
    GET_DATA_USD_RATE_FAILURE,
    CHECK_ETHEREUM_NETWORK_REQUEST,
    CHECK_ETHEREUM_NETWORK_SUCCESS,
    CHECK_ETHEREUM_NETWORK_FAILURE,
    CHECK_METAMASK,
} from './constants'
import type { DataPerUsdAction, GlobalEthereumErrorAction, IsMetaMaskInUseAction } from './types'

export const initialState: GlobalState = {
    dataPerUsd: null,
    ethereumNetworkIsCorrect: null,
    checkingNetwork: false,
    fetchingDataPerUsdRate: false,
    ethereumNetworkError: null,
    dataPerUsdRateError: null,
    isMetaMaskInUse: null,
}

const reducer: (GlobalState) => GlobalState = handleActions({
    [GET_DATA_USD_RATE_REQUEST]: (state: GlobalState) => ({
        ...state,
        fetchingDataPerUsdRate: true,
    }),

    [GET_DATA_USD_RATE_SUCCESS]: (state: GlobalState, action: DataPerUsdAction) => ({
        ...state,
        dataPerUsd: action.payload.dataPerUsd,
        fetchingDataPerUsdRate: false,
    }),

    [GET_DATA_USD_RATE_FAILURE]: (state: GlobalState, action: GlobalEthereumErrorAction) => ({
        ...state,
        dataPerUsdRateError: action.payload.error,
        fetchingDataPerUsdRate: false,
    }),

    [CHECK_ETHEREUM_NETWORK_REQUEST]: (state: GlobalState) => ({
        ...state,
        checkingNetwork: true,
    }),

    [CHECK_ETHEREUM_NETWORK_SUCCESS]: (state: GlobalState) => ({
        ...state,
        ethereumNetworkIsCorrect: true,
        checkingNetwork: false,
    }),

    [CHECK_ETHEREUM_NETWORK_FAILURE]: (state: GlobalState, action: GlobalEthereumErrorAction) => ({
        ...state,
        ethereumNetworkIsCorrect: false,
        ethereumNetworkError: action.payload.error,
        checkingNetwork: false,
    }),

    [CHECK_METAMASK]: (state: GlobalState, action: IsMetaMaskInUseAction) => ({
        ...state,
        isMetaMaskInUse: action.payload.isMetaMaskInUse,
    }),

}, initialState)

export default reducer
