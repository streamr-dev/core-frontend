// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type TransactionError from '../../errors/TransactionError'

export type AllowanceAction = PayloadAction<{
    allowance: number,
}>
export type AllowanceActionCreator = (number) => AllowanceAction

export type GetAllowanceErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GetAllowanceErrorActionCreator = (ErrorInUi) => GetAllowanceErrorAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type SetAllowanceErrorAction = PayloadAction<{
    error: TransactionError,
}>
export type SetAllowanceErrorActionCreator = (TransactionError) => SetAllowanceErrorAction
