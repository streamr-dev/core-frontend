// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

export type AccountAction = PayloadAction<{
    account: Address,
}>
export type AccountActionCreator = (account: Address) => AccountAction

export type AccountErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type AccountErrorActionCreator = (error: ErrorInUi) => AccountErrorAction
