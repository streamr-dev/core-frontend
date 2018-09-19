// @flow

import { handleActions } from 'redux-actions'

import type { Web3State } from '../../flowtype/store-state'

import {
    RECEIVE_ACCOUNT,
    CHANGE_ACCOUNT,
    ACCOUNT_ERROR,
    UPDATE_ETHEREUM_NETWORK_ID,
} from './constants'
import type { AccountAction, AccountErrorAction, EthereumNetworkIdAction } from './types'

export const initialState: Web3State = {
    accountId: null,
    error: null,
    enabled: false,
    ethereumNetworkId: null,
}

const reducer: (Web3State) => Web3State = handleActions({
    [RECEIVE_ACCOUNT]: (state: Web3State, action: AccountAction): Web3State => ({
        ...state,
        accountId: action.payload.id,
        error: null,
        enabled: true,
    }),

    [CHANGE_ACCOUNT]: (state: Web3State, action: AccountAction) => ({
        ...state,
        accountId: action.payload.id,
        error: null,
        enabled: true,
    }),

    [ACCOUNT_ERROR]: (state: Web3State, action: AccountErrorAction) => ({
        ...state,
        accountId: null,
        error: action.payload.error,
        enabled: false,
    }),

    [UPDATE_ETHEREUM_NETWORK_ID]: (state: Web3State, action: EthereumNetworkIdAction) => ({
        ...state,
        ethereumNetworkId: action.payload.id,
    }),

}, initialState)

export default reducer
