// @flow

import type {PayloadAction, ErrorInUi} from '../../flowtype/common-types'
import type {ProductId, ProductIdList} from '../../flowtype/product-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type ProductsAction = PayloadAction<{
    products: ProductIdList,
}>
export type ProductsActionCreator = (products: ProductIdList) => ProductsAction

export type ProductsErrorAction = PayloadAction<{
    error: ErrorInUi
}>
export type ProductsErrorActionCreator = (error: ErrorInUi) => ProductsErrorAction

export type SearchTextAction = PayloadAction<{
    text: string,
}>
export type SearchTextActionCreator = (text: string) => SearchTextAction

export type CategoryAction = PayloadAction<{
    category: ?string,
}>
export type CategoryActionCreator = (category: ?string) => CategoryAction
