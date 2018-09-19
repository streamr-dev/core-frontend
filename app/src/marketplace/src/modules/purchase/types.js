// @flow

import type { PayloadAction, ErrorInUi, ErrorFromApi, NumberString } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { Hash } from '../../flowtype/web3-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type PurchaseAction = PayloadAction<{
    productId: ProductId,
    subscriptionInSeconds: NumberString,
}>
export type PurchaseActionCreator = (ProductId, NumberString) => PurchaseAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type PurchaseErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type PurchaseErrorActionCreator = (ErrorInUi) => PurchaseErrorAction

export type ProductErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorFromApi,
}>
export type ProductErrorActionCreator = (ProductId, ErrorFromApi) => ProductErrorAction
