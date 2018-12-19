// @flow

import type { ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'
import type { ProductId, ProductIdList } from '../../flowtype/product-types'
import type { Filter } from '$userpages/flowtype/common-types'

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

export type MyPurchasesFilterAction = PayloadAction<{
    filter: Filter
}>
export type MyPurchasesFilterActionCreator = (filter: Filter) => MyPurchasesFilterAction
