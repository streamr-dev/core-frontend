import { PayloadAction } from '$shared/types/common-types'
import { Hash } from '$shared/types/web3-types'
export type TransactionIdAction = PayloadAction<{
    id: Hash
}>
export type TransactionIdActionCreator = (arg0: Hash) => TransactionIdAction
