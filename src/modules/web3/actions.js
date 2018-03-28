// @flow

import { createAction } from 'redux-actions'

import type { ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import type { AccountActionCreator } from './types'

import {
    RECEIVE_ACCOUNT,
    CHANGE_ACCOUNT,
    ACCOUNT_ERROR,
} from './constants'

export const receiveAccount: AccountActionCreator = createAction(RECEIVE_ACCOUNT, (account: Address) => ({
    account,
}))

export const changeAccount: AccountActionCreator = createAction(CHANGE_ACCOUNT, (account: Address) => ({
    account,
}))

export const accountError: ReduxActionCreator = createAction(ACCOUNT_ERROR)
