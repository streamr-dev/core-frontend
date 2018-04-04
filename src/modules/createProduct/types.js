// @flow

import type { PayloadAction, ErrorFromApi } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

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

export type ImageAction = PayloadAction<{
    image: File,
}>
export type ImageActionCreator = (image: File) => ImageAction

export type ImageResultAction = PayloadAction<{
    imageUrl: string,
}>
export type ImageResultActionCreator = (imageUrl: string) => ImageResultAction

export type ImageErrorAction = PayloadAction<{
    error: ErrorFromApi,
}>
export type ImageErrorActionCreator = (error: ErrorFromApi) => ImageErrorAction
