import { handleActions } from 'redux-actions'

import {
    GET_DATA_USD_RATE_REQUEST,
    GET_DATA_USD_RATE_SUCCESS,
    GET_DATA_USD_RATE_FAILURE,
    SET_ETHEREUM_NETWORK_ID,
} from './constants'

export const initialState = {
    dataPerUsd: null,
    fetchingDataPerUsdRate: false,
    dataPerUsdRateError: null,
    networkId: undefined,
}

const reducer = handleActions({
    [GET_DATA_USD_RATE_REQUEST]: (state) => ({
        ...state,
        fetchingDataPerUsdRate: true,
    }),

    [GET_DATA_USD_RATE_SUCCESS]: (state, action) => ({
        ...state,
        dataPerUsd: action.payload.dataPerUsd,
        fetchingDataPerUsdRate: false,
    }),

    [GET_DATA_USD_RATE_FAILURE]: (state, action) => ({
        ...state,
        dataPerUsdRateError: action.payload.error,
        fetchingDataPerUsdRate: false,
    }),

    [SET_ETHEREUM_NETWORK_ID]: (state, action) => ({
        ...state,
        networkId: action.payload.networkId,
    }),

}, initialState)

export default reducer
