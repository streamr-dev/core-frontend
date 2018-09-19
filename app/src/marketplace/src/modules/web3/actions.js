// @flow

import { createAction } from 'redux-actions'

import { getAllowance } from '../allowance/actions'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

import { checkEthereumNetwork } from '../../modules/global/actions'

import type { AccountActionCreator, AccountErrorActionCreator, EthereumNetworkIdActionCreator } from './types'

import {
    RECEIVE_ACCOUNT,
    CHANGE_ACCOUNT,
    ACCOUNT_ERROR,
    UPDATE_ETHEREUM_NETWORK_ID,
} from './constants'

const receiveAccountRequest: AccountActionCreator = createAction(RECEIVE_ACCOUNT, (id: Address) => ({
    id,
}))

const changeAccountRequest: AccountActionCreator = createAction(CHANGE_ACCOUNT, (id: Address) => ({
    id,
}))

export const accountError: AccountErrorActionCreator = createAction(ACCOUNT_ERROR, (error: ErrorInUi) => ({
    error,
}))

export const receiveAccount = (id: Address) => (dispatch: Function) => {
    dispatch(receiveAccountRequest(id))
    dispatch(getAllowance())
}

export const changeAccount = (id: Address) => (dispatch: Function) => {
    dispatch(changeAccountRequest(id))
    dispatch(getAllowance())
}

export const updateEthereumNetworkIdAction: EthereumNetworkIdActionCreator = createAction(UPDATE_ETHEREUM_NETWORK_ID, (id: Number) => ({
    id,
}))

export const updateEthereumNetworkId = (id: any) => (dispatch: Function) => {
    dispatch(updateEthereumNetworkIdAction(id))
    dispatch(checkEthereumNetwork())
}
