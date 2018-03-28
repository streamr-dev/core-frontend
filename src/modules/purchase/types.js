// @flow

import type { PayloadAction } from '../../flowtype/common-types'
import type { ProductId, PurchaseError, HashError, Hash, Receipt } from '../../flowtype/web3-types'

export type PurchaseAction = PayloadAction<{
    productId: ProductId,
}>
export type PurchaseActionCreator = (ProductId) => PurchaseAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type PurchaseErrorAction = PayloadAction<{
    receipt: Receipt,
    error: PurchaseError,
}>
export type PurchaseErrorActionCreator = (PurchaseError, Receipt) => PurchaseErrorAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (ProductId, Hash) => HashAction

export type HashErrorAction = PayloadAction<{
    error: HashError,
}>
export type HashErrorActionCreator = (ProductId, HashError) => HashErrorAction
