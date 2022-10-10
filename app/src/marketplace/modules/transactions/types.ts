import type { PayloadAction } from '$shared/types/common-types'
import type { Hash } from '$shared/types/web3-types'
export type TransactionIdAction = PayloadAction<{
    id: Hash
}>
export type TransactionIdActionCreator = (arg0: Hash) => TransactionIdAction
