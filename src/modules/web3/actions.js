// @flow

import { createAction } from 'redux-actions'

import { getAllowance } from '../allowance/actions'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

import type { AccountActionCreator, AccountErrorActionCreator } from './types'

import {
    RECEIVE_ACCOUNT,
    CHANGE_ACCOUNT,
    ACCOUNT_ERROR,
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
