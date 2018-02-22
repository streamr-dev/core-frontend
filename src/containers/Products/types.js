// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {Product} from '../../flowtype/product-types'

export type ProductIdAction = PayloadAction<{
    id: $ElementType<Product, 'id'>,
}>

export type ProductsAction = PayloadAction<{
    products: Array<Product>,
}>

export type ProductAction = PayloadAction<{
    product: Product,
}>

export type ProductsErrorAction = PayloadAction<{
    error: ErrorFromApi
}>

export type ProductErrorAction = PayloadAction<{
    id: $ElementType<Product, 'id'>,
    error: ErrorFromApi
}>
