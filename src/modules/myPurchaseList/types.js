// @flow

import type { PayloadAction, ErrorInUi } from '../../flowtype/common-types'
import type { ProductId, ProductIdList } from '../../flowtype/product-types'

export type MyPurchaseIdAction = PayloadAction<{
    id: ProductIdList,
}>
export type MyPurchaseIdActionCreator = (ProductId) => MyPurchaseIdAction

export type MyPurchasesAction = PayloadAction<{
    products: ProductIdList,
}>
export type MyPurchasesActionCreator = (products: ProductIdList) => MyPurchasesAction

export type MyPurchasesErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type MyPurchasesErrorActionCreator = (error: ErrorInUi) => MyPurchasesErrorAction
