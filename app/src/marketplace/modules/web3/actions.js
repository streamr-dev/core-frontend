// @flow

import { createAction } from 'redux-actions'

import { getDataAllowance } from '$mp/modules/allowance/actions'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'

import { checkEthereumNetwork } from '$mp/modules/global/actions'

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
    dispatch(getDataAllowance())
}

export const changeAccount = (id: Address) => (dispatch: Function) => {
    dispatch(changeAccountRequest(id))
    dispatch(getDataAllowance())
}

export const updateEthereumNetworkIdAction: EthereumNetworkIdActionCreator = createAction(UPDATE_ETHEREUM_NETWORK_ID, (id: Number) => ({
    id,
}))

export const updateEthereumNetworkId = (id: any) => (dispatch: Function) => {
    dispatch(updateEthereumNetworkIdAction(id))
    dispatch(checkEthereumNetwork())
}
