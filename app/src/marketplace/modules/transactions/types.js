// @flow

import type { PayloadAction } from '$shared/flowtype/common-types'
import type { Hash } from '../../flowtype/web3-types'

export type TransactionIdAction = PayloadAction<{
    id: Hash,
}>
export type TransactionIdActionCreator = (Hash) => TransactionIdAction
