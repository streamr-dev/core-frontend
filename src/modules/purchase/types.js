// @flow

import type { PayloadAction } from '../../flowtype/common-types'
import type { ProductId, PurchaseError, TxHashError, TxHash, Receipt } from '../../flowtype/web3-types'

export type PurchaseAction = PayloadAction<{
    id: ProductId,
}>
export type PurchaseActionCreator = (ProductId) => ContractProductIdAction

export type PurchaseErrorAction = PayloadAction<{
    id: ProductId,
    receipd: Receipt,
    error: PurchaseError,
}>
export type PurchaseErrorActionCreator = (ProductId, PurchaseError, Receipt) => PurchaseErrorAction

export type TxHashAction = PayloadAction<{
    id: ProductId,
    hash: TxHash,
}>
export type TxHashActionCreator = (ProductId, TxHash) => TxHashAction

export type TxHashErrorAction = PayloadAction<{
    id: ProductId,
    error: TxHashError,
}>
export type TxHashErrorActionCreator = (ProductId, TxHashError) => TxHashErrorAction
