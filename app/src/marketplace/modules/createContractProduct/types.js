// @flow

import type { PayloadAction, ErrorInUi } from '$mp/flowtype/common-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { Hash } from '$mp/flowtype/web3-types'

export type ModifyProductAction = PayloadAction<{
    productId: ProductId,
}>
export type ModifyProductActionCreator = (ProductId) => ModifyProductAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type ModifyProductErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type ModifyProductErrorActionCreator = (ErrorInUi) => ModifyProductErrorAction

