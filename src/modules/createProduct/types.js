// @flow

import type {PayloadAction, ErrorFromApi} from '../../flowtype/common-types'
import type {ProductPreview} from '../../flowtype/product-types'

export type ProductAction = PayloadAction<{
    product: ProductPreview
}>
export type ProductActionCreator = (product: ProductPreview) => ProductAction

export type UpdateProductFieldAction = PayloadAction<{
    field: string,
    data: any,
}>
export type UpdateProductFieldActionCreator = (field: string, data: any) => UpdateProductFieldAction

export type ProductErrorAction = PayloadAction<{
    error: ErrorFromApi
}>
export type ProductErrorActionCreator = (error: ErrorFromApi) => ProductErrorAction
