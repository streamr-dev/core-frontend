// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {Product} from '../../flowtype/product-types'

export type ProductIdAction = PayloadAction<{
    id: $ElementType<Product, 'id'>,
}>
export type ProductIdActionCreator = ($ElementType<Product, 'id'>) => ProductIdAction

export type ProductsAction = PayloadAction<{
    products: Array<Product>,
}>
export type ProductsActionCreator = (products: Array<Product>) => ProductsAction

export type ProductAction = PayloadAction<{
    product: Product,
}>
export type ProductActionCreator = (product: Product) => ProductAction

export type ProductsErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type ProductsErrorActionCreator = (error: ErrorFromApi) => ProductsErrorAction

export type ProductErrorAction = PayloadAction<{
    id: $ElementType<Product, 'id'>,
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (id: $ElementType<Product, 'id'>, error: ErrorFromApi) => ProductErrorAction
