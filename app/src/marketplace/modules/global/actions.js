// @flow

import { createAction } from 'redux-actions'

import {
    GET_DATA_USD_RATE_REQUEST,
    GET_DATA_USD_RATE_SUCCESS,
    GET_DATA_USD_RATE_FAILURE,
    SET_ETHEREUM_NETWORK_ID,
} from './constants'
import * as services from './services'

const getDataPerUsdRequest = createAction(GET_DATA_USD_RATE_REQUEST)

const getDataPerUsdSuccess = createAction(
    GET_DATA_USD_RATE_SUCCESS,
    (dataPerUsd) => ({
        dataPerUsd,
    }),
)

const getDataPerUsdError = createAction(
    GET_DATA_USD_RATE_FAILURE,
    (error) => ({
        error,
    }),
)

export const getDataPerUsd = (chainId: number) => (dispatch: Function) => {
    dispatch(getDataPerUsdRequest())
    return services
        .getDataPerUsd(chainId)
        .then(
            (dataPerUsd) => dispatch(getDataPerUsdSuccess(dataPerUsd)),
            (error) => {
                dispatch(getDataPerUsdError({
                    message: error.message,
                }))
            },
        )
}

export const setEthereumNetworkId = createAction(
    SET_ETHEREUM_NETWORK_ID,
    (networkId) => ({
        networkId,
    }),
)
