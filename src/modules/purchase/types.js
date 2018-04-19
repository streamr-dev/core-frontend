// @flow

import type { PayloadAction, ErrorFromApi } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type TransactionError from '../../errors/TransactionError'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

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

export type ProductErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorFromApi,
}>
export type ProductErrorActionCreator = (ProductId, ErrorFromApi) => ProductErrorAction
