// @flow

import type {PayloadAction, ErrorInUi} from '../../flowtype/common-types'
import type {ProductId, ProductIdList, Filter} from '../../flowtype/product-types'

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

export type FilterAction = PayloadAction<{
    filter: Filter,
}>

export type FilterActionCreator = (filter: Filter) => FilterAction
