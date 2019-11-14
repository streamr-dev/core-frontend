// @flow

import type { ErrorFromApi, PayloadAction } from '$shared/flowtype/common-types'
import type { EditProduct } from '$mp/flowtype/product-types'

export type EditProductAction = PayloadAction<{
    product: EditProduct
}>

export type EditProductActionCreator = (EditProduct) => EditProductAction

export type EditProductErrorAction = PayloadAction<{
    error: ErrorFromApi
}>

export type EditProductErrorActionCreator = (error: ErrorFromApi) => EditProductErrorAction

export type EditProductFieldAction = PayloadAction<{
    field: string,
    data: any,
}>

export type EditProductFieldActionCreator = (field: string, data: any) => EditProductFieldAction

export type ImageAction = PayloadAction<{
    image: File,
}>
export type ImageActionCreator = (image: File) => ImageAction

export type ImageResultAction = PayloadAction<{
    imageUrl: string,
}>
export type ImageResultActionCreator = () => ImageResultAction

export type ImageErrorAction = PayloadAction<{
    error: ErrorFromApi,
}>
export type ImageErrorActionCreator = (error: ErrorFromApi) => ImageErrorAction
