// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import { push } from 'react-router-redux'

import {
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FIELD,
    RESET_PRODUCT,
    POST_PRODUCT_REQUEST,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
    IMAGE_UPLOAD_SET_IMAGE,
    IMAGE_UPLOAD_REQUEST,
    IMAGE_UPLOAD_SUCCESS,
    IMAGE_UPLOAD_FAILURE,
} from './constants'
import { selectProduct, selectImageToUpload } from './selectors'
import * as api from './services'
import { productSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import { formatPath } from '../../utils/url'

import type {
    ProductActionCreator,
    UpdateProductFieldActionCreator,
    ProductErrorActionCreator,
    ImageActionCreator,
    ImageResultActionCreator,
    ImageErrorActionCreator,
} from './types'
import type { Product, ProductId } from '../../flowtype/product-types'
import type { ReduxActionCreator, ErrorFromApi } from '../../flowtype/common-types'
import links from '../../links'

export const updateProduct: ProductActionCreator = createAction(UPDATE_PRODUCT, (product: Product) => ({
    product,
}))

export const updateProductField: UpdateProductFieldActionCreator = createAction(
    UPDATE_PRODUCT_FIELD,
    (field: string, data: any) => ({
        field,
        data,
    }),
)

export const resetProduct: ReduxActionCreator = createAction(RESET_PRODUCT)

export const postProductRequest: ReduxActionCreator = createAction(POST_PRODUCT_REQUEST)

export const postProductSuccess: ReduxActionCreator = createAction(POST_PRODUCT_SUCCESS)

export const postProductError: ProductErrorActionCreator = createAction(
    POST_PRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    }),
)

export const setImageToUpload: ImageActionCreator = createAction(IMAGE_UPLOAD_SET_IMAGE, (image: File) => ({
    image,
}))

export const imageUploadRequest: ImageActionCreator = createAction(IMAGE_UPLOAD_REQUEST, (image: File) => ({
    image,
}))

export const imageUploadSuccess: ImageResultActionCreator = createAction(IMAGE_UPLOAD_SUCCESS, (imageUrl: string) => ({
    imageUrl,
}))

export const imageUploadError: ImageErrorActionCreator = createAction(IMAGE_UPLOAD_FAILURE, (error: ErrorFromApi) => ({
    error,
}))

export const initProduct = () => (dispatch: Function) => {
    dispatch(updateProduct({
        id: null,
        name: '',
        description: '',
        imageUrl: '',
        category: null,
        streams: [],
        previewStream: null,
        ownerAddress: '',
        beneficiaryAddress: '',
        pricePerSecond: 0,
        priceCurrency: 'DATA',
        timeUnit: null,
    }))
}

export const uploadImage = (id: ProductId, image: File) => (dispatch: Function) => {
    dispatch(imageUploadRequest(image))
    return api.postImage(id, image)
        .then((data) => {
            dispatch(imageUploadSuccess(data))
        })
        .catch((error) => dispatch(imageUploadError(error)))
}

export const createProduct = () => (dispatch: Function, getState: Function) => {
    dispatch(postProductRequest())

    const product = selectProduct(getState())
    const image = selectImageToUpload(getState())

    return api.postProduct(product)
        .then((data) => {
            const { result, entities } = normalize(data, productSchema)

            dispatch(updateEntities(entities))
            dispatch(postProductSuccess())
            dispatch(resetProduct())

            if (image) {
                dispatch(uploadImage(product.id, image))
            }

            dispatch(push(formatPath(links.products, result)))
        })
        .catch((error) => dispatch(postProductError(error)))
}
