// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {Product} from '../../flowtype/product-types'

export type ProductAction = PayloadAction<{
    product: Product
}>
export type ProductActionCreator = (product: Product) => ProductAction

export type UpdateProductFieldAction = PayloadAction<{
    field: string,
    data: any,
}>
export type UpdateProductFieldActionCreator = (field: string, data: any) => UpdateProductFieldAction

export type ProductErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (error: ErrorFromApi) => ProductErrorAction
