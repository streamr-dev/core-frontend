// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
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
    error: ErrorFromApi
}>
export type ProductsErrorActionCreator = (error: ErrorFromApi) => ProductsErrorAction
