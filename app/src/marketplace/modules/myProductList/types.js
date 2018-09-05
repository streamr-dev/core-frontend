// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId, ProductIdList } from '../../flowtype/product-types'

export type MyProductIdAction = PayloadAction<{
    id: ProductIdList,
}>
export type MyProductIdActionCreator = (ProductId) => MyProductIdAction

export type MyProductsAction = PayloadAction<{
    products: ProductIdList,
}>
export type MyProductsActionCreator = (products: ProductIdList) => MyProductsAction

export type MyProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type MyProductsErrorActionCreator = (error: ErrorInUi) => MyProductsErrorAction
