// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type PublishAction = PayloadAction<{
    id: ProductId,
    isPublish: boolean,
}>
export type PublishActionCreator = (id: ProductId, isPublish: boolean) => PublishAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ReceiptAction = PayloadAction<{
    receipt: Receipt,
}>
export type ReceiptActionCreator = (Receipt) => ReceiptAction

export type PublishErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorInUi,
}>
export type PublishErrorActionCreator = (ProductId, ErrorInUi) => PublishErrorAction

