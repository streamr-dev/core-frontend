// @flow

import { handleActions } from 'redux-actions'

import {
    RECEIVE_ACCOUNT,
    CHANGE_ACCOUNT,
    ACCOUNT_ERROR,
} from './constants'
import type { Web3State } from '../../flowtype/store-state'
import type { AccountAction } from './types'

const initialState: Web3State = {
    account: null,
}

const reducer: (Web3State) => Web3State = handleActions({
    [RECEIVE_ACCOUNT]: (state: Web3State, action: AccountAction): Web3State => ({
        ...state,
        account: action.payload.account,
    }),

    [CHANGE_ACCOUNT]: (state: Web3State, action: AccountAction) => ({
        ...state,
        account: action.payload.account,
    }),

    [ACCOUNT_ERROR]: (state: Web3State) => ({
        ...state,
        account: null,
    }),

}, initialState)

export default reducer
