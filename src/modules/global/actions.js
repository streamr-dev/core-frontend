// @flow

import { createAction } from 'redux-actions'

import type { ReduxActionCreator, ErrorInUi, NumberString } from '../../flowtype/common-types'
import type TransactionError from '../../errors/TransactionError'

import {
    GET_DATA_USD_RATE_REQUEST,
    GET_DATA_USD_RATE_SUCCESS,
    GET_DATA_USD_RATE_FAILURE,
    CHECK_ETHEREUM_NETWORK_REQUEST,
    CHECK_ETHEREUM_NETWORK_SUCCESS,
    CHECK_ETHEREUM_NETWORK_FAILURE,
    UPDATE_METAMASK_PERMISSION,
    CHECK_WEB3,
} from './constants'
import type { DataPerUsdActionCreator, GlobalEthereumErrorActionCreator, MetamaskPermissionActionCreator, IsWeb3InjectedActionCreator } from './types'
import * as services from './services'

const getDataPerUsdRequest: ReduxActionCreator = createAction(GET_DATA_USD_RATE_REQUEST)

const getDataPerUsdSuccess: DataPerUsdActionCreator = createAction(
    GET_DATA_USD_RATE_SUCCESS,
    (dataPerUsd: NumberString) => ({
        dataPerUsd,
    }),
)

const getDataPerUsdError: GlobalEthereumErrorActionCreator = createAction(
    GET_DATA_USD_RATE_FAILURE,
    (error: TransactionError) => ({
        error,
    }),
)

export const getDataPerUsd = () => (dispatch: Function) => {
    dispatch(getDataPerUsdRequest())
    return services
        .getDataPerUsd()
        .then(
            (dataPerUsd: NumberString) => dispatch(getDataPerUsdSuccess(dataPerUsd)),
            (error: TransactionError) => {
                dispatch(getDataPerUsdError({
                    message: error.message,
                }))
            },
        )
}

const checkEthereumNetworkRequest: ReduxActionCreator = createAction(CHECK_ETHEREUM_NETWORK_REQUEST)

const checkEthereumNetworkSuccess: ReduxActionCreator = createAction(CHECK_ETHEREUM_NETWORK_SUCCESS)

const checkEthereumNetworkError: GlobalEthereumErrorActionCreator = createAction(
    CHECK_ETHEREUM_NETWORK_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const checkEthereumNetwork = () => (dispatch: Function) => {
    dispatch(checkEthereumNetworkRequest())
    return services
        .checkEthereumNetworkIsCorrect()
        .then(
            () => dispatch(checkEthereumNetworkSuccess()),
            (error: TransactionError) => {
                dispatch(checkEthereumNetworkError({
                    message: error.message,
                }))
            },
        )
}

export const updateMetamaskPermission: MetamaskPermissionActionCreator = createAction(
    UPDATE_METAMASK_PERMISSION,
    (metamaskPermission: boolean) => ({
        metamaskPermission,
    }),
)
const checkWeb3Success: IsWeb3InjectedActionCreator = createAction(
    CHECK_WEB3,
    (isWeb3Injected: boolean) => ({
        isWeb3Injected,
    }),
)

export const checkWeb3 = (confirmedInjection: boolean = false) => (dispatch: Function) => {
    const isWeb3Injected = confirmedInjection || services.isWeb3Injected()
    dispatch(checkWeb3Success(isWeb3Injected))
}
