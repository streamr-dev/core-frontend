// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'

export type ModifyProductAction = PayloadAction<{
    productId: ProductId,
    product: SmartContractProduct,
}>
export type ModifyProductActionCreator = (ProductId, SmartContractProduct) => ModifyProductAction

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

