// @flow

import type { ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'

export type ModifyProductAction = PayloadAction<{
    productId: ProductId,
}>
export type ModifyProductActionCreator = (ProductId) => ModifyProductAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type ModifyProductErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type ModifyProductErrorActionCreator = (ErrorInUi) => ModifyProductErrorAction

