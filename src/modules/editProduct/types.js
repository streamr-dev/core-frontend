// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type { EditProduct, Product } from '../../flowtype/product-types'

export type ProductAction = PayloadAction<{
    product: Product
}>
export type ProductActionCreator = (product: Product) => ProductAction

export type UpdateProductFieldActionCreator = (field: string, data: any) => UpdateProductFieldAction

export type UpdateProductFieldAction = PayloadAction<{
    field: string,
    data: any,
}>

export type ProductErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (error: ErrorFromApi) => ProductErrorAction

export type EditProductErrorAction = PayloadAction<{
    error: ErrorFromApi
}>

export type EditProductErrorActionCreator = (error: ErrorFromApi) => EditProductErrorAction

export type EditProductAction = PayloadAction<{
    product: EditProduct
}>

export type EditProductFieldActionCreator = (field: string, data: any) => EditProductFieldAction

export type EditProductFieldAction = PayloadAction<{
    field: string,
    data: any,
}>

// TODO check for unused product stuff here
