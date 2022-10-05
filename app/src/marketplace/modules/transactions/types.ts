import type { PayloadAction } from '$shared/flowtype/common-types'
import type { Hash } from '$shared/flowtype/web3-types'
export type TransactionIdAction = PayloadAction<{
    id: Hash
}>
export type TransactionIdActionCreator = (arg0: Hash) => TransactionIdAction
