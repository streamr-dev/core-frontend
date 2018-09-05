// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId, ProductIdList } from '../../flowtype/product-types'

export type relatedProductIdAction = PayloadAction<{
    id: ProductIdList,
}>
export type relatedProductIdActionCreator = (ProductId) => relatedProductIdAction

export type RelatedProductsAction = PayloadAction<{
    products: ProductIdList,
}>
export type RelatedProductsActionCreator = (products: ProductIdList) => RelatedProductsAction

export type RelatedProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type RelatedProductsErrorActionCreator = (error: ErrorInUi) => RelatedProductsErrorAction
