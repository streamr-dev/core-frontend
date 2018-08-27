// @flow

import type { PayloadAction, ErrorInUi, NumberString } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

export type AccountAction = PayloadAction<{
    id: Address,
}>
export type AccountActionCreator = (id: Address) => AccountAction

export type AccountErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type AccountErrorActionCreator = (error: ErrorInUi) => AccountErrorAction

export type EthereumNetworkIdAction = PayloadAction<{
    id: NumberString,
}>
export type EthereumNetworkIdActionCreator = (id: NumberString) => AccountAction
