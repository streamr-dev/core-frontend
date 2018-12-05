// @flow

import { createAction } from 'redux-actions'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { Web3AccountList } from '$shared/flowtype/web3-types'
import type {
    IntegrationKeysActionCreator,
    IntegrationKeysErrorActionCreator,
} from './types'

import * as services from './services'
import {
    INTEGRATION_KEYS_REQUEST,
    INTEGRATION_KEYS_SUCCESS,
    INTEGRATION_KEYS_FAILURE,
} from './constants'

const integrationKeysRequest: ReduxActionCreator = createAction(INTEGRATION_KEYS_REQUEST)
const integrationKeysSuccess: IntegrationKeysActionCreator = createAction(
    INTEGRATION_KEYS_SUCCESS,
    (ethereumIdentities: Web3AccountList, privateKeys: Web3AccountList) => ({
        ethereumIdentities,
        privateKeys,
    }),
)
const integrationKeysError: IntegrationKeysErrorActionCreator = createAction(INTEGRATION_KEYS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Fetch linked web3 accounts from integration keys
export const fetchIntegrationKeys = () => (dispatch: Function) => {
    dispatch(integrationKeysRequest())

    return services.getIntegrationKeys()
        .then((result) => {
            const ethereumIdentities = []
            const privateKeys = []

            result.forEach(({ service, name, json }) => {
                if (service === 'ETHEREUM_ID') {
                    ethereumIdentities.push({
                        address: json.address,
                        name,
                    })
                }

                if (service === 'ETHEREUM') {
                    privateKeys.push({
                        address: json.address,
                        name,
                    })
                }
            })
            return {
                ethereumIdentities,
                privateKeys,
            }
        })
        .then(({ ethereumIdentities, privateKeys }) => {
            dispatch(integrationKeysSuccess(ethereumIdentities, privateKeys))
        }, (error) => {
            dispatch(integrationKeysError(error))
        })
}
