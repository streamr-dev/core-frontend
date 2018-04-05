// @flow

import type { PayloadAction, ErrorFromApi } from '../../flowtype/common-types'
import type { EditProduct } from '../../flowtype/product-types'

export type EditProductAction = PayloadAction<{
    product: EditProduct
}>

export type EditProductActionCreator = (product: EditProduct) => EditProductAction

export type EditProductErrorAction = PayloadAction<{
    error: ErrorFromApi
}>

export type EditProductErrorActionCreator = (error: ErrorFromApi) => EditProductErrorAction

export type EditProductFieldActionCreator = (field: string, data: any) => EditProductFieldAction

export type EditProductFieldAction = PayloadAction<{
    field: string,
    data: any,
}>
