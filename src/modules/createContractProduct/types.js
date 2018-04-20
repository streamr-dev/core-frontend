// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'

export type CreateProductAction = PayloadAction<{
    productId: ProductId,
    product: SmartContractProduct,
}>
export type CreateProductActionCreator = (ProductId, SmartContractProduct) => CreateProductAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type CreateProductErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type CreateProductErrorActionCreator = (ErrorInUi) => CreateProductErrorAction

