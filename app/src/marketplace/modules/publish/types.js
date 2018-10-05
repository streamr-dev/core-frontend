// @flow

import type { PayloadAction, ErrorInUi } from '$mp/flowtype/common-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { Hash } from '$mp/flowtype/web3-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type PublishAction = PayloadAction<{
    id: ProductId,
}>
export type PublishActionCreator = (id: ProductId) => PublishAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type PublishErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorInUi,
}>
export type PublishErrorActionCreator = (ProductId, ErrorInUi) => PublishErrorAction

