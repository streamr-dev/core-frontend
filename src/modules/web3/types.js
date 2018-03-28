// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'

export type AccountAction = PayloadAction<{
    account: Address,
}>
export type AccountActionCreator = (account: Address) => AccountAction

