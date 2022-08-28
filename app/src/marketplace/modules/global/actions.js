// @flow

import { createAction } from 'redux-actions'

import { SET_ETHEREUM_NETWORK_ID } from './constants'

export const setEthereumNetworkId = createAction(
    SET_ETHEREUM_NETWORK_ID,
    (networkId) => ({
        networkId,
    }),
)
