// @flow

import { createAction } from 'redux-actions'

import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import type { AccountActionCreator, AccountErrorActionCreator } from './types'

import {
    RECEIVE_ACCOUNT,
    CHANGE_ACCOUNT,
    ACCOUNT_ERROR,
} from './constants'

export const receiveAccount: AccountActionCreator = createAction(RECEIVE_ACCOUNT, (id: Address) => ({
    id,
}))

export const changeAccount: AccountActionCreator = createAction(CHANGE_ACCOUNT, (id: Address) => ({
    id,
}))

export const accountError: AccountErrorActionCreator = createAction(ACCOUNT_ERROR, (error: ErrorInUi) => ({
    error,
}))
