// @flow

import type { PayloadAction } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type TransactionError from '../../errors/TransactionError'

export type PurchaseAction = PayloadAction<{
    productId: ProductId,
    subscriptionInSeconds: number,
}>
export type PurchaseActionCreator = (ProductId, number) => PurchaseAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type PurchaseErrorAction = PayloadAction<{
    error: TransactionError,
}>
export type PurchaseErrorActionCreator = (TransactionError) => PurchaseErrorAction

