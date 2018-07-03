// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import BN from 'bignumber.js'
import { push } from 'react-router-redux'
import { I18n } from '@streamr/streamr-layout'

import { handleEntities } from '../product/actions'
import { selectProduct } from '../../modules/product/selectors'
import { productSchema } from '../../modules/entities/schema'
import { updateEntities } from '../../modules/entities/actions'
import { showNotification } from '../../modules/notifications/actions'
import { notificationIcons, productStates } from '../../utils/constants'
import type { EditProduct, ProductId } from '../../flowtype/product-types'
import type { ReduxActionCreator, ErrorFromApi } from '../../flowtype/common-types'

import {
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_FIELD,
    RESET_PRODUCT,
    PUT_PRODUCT_REQUEST,
    PUT_PRODUCT_SUCCESS,
    PUT_PRODUCT_FAILURE,
    POST_PRODUCT_REQUEST,
    POST_PRODUCT_SUCCESS,
    POST_PRODUCT_FAILURE,
    IMAGE_UPLOAD_SET_IMAGE,
    IMAGE_UPLOAD_REQUEST,
    IMAGE_UPLOAD_SUCCESS,
    IMAGE_UPLOAD_FAILURE,
} from './constants'
import { selectEditProduct, selectImageToUpload } from './selectors'
import * as api from './services'
import type {
    EditProductActionCreator,
    EditProductFieldActionCreator,
    EditProductErrorActionCreator,
    ImageActionCreator,
    ImageResultActionCreator,
    ImageErrorActionCreator,
} from './types'

export const updateEditProduct: EditProductActionCreator = createAction(
    UPDATE_PRODUCT,
    (product: EditProduct) => ({
        product,
    }),
)

export const updateEditProductField: EditProductFieldActionCreator = createAction(
    UPDATE_PRODUCT_FIELD,
    (field: string, data: any) => ({
        field,
        data,
    }),
)
export const postProductRequest: ReduxActionCreator = createAction(POST_PRODUCT_REQUEST)

export const postProductSuccess: ReduxActionCreator = createAction(POST_PRODUCT_SUCCESS)

export const postProductError: EditProductErrorActionCreator = createAction(
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

export const imageUploadSuccess: ImageResultActionCreator = createAction(IMAGE_UPLOAD_SUCCESS)

export const imageUploadError: ImageErrorActionCreator = createAction(IMAGE_UPLOAD_FAILURE, (error: ErrorFromApi) => ({
    error,
}))

export const resetEditProduct: ReduxActionCreator = createAction(RESET_PRODUCT)

export const putEditProductRequest: ReduxActionCreator = createAction(PUT_PRODUCT_REQUEST)

export const putEditProductSuccess: ReduxActionCreator = createAction(PUT_PRODUCT_SUCCESS)

export const putEditProductError: EditProductErrorActionCreator = createAction(
    PUT_PRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    }),
)

export const initEditProduct = () => (dispatch: Function, getState: Function) => {
    const product = selectProduct(getState())
    if (product) {
        dispatch(updateEditProduct({
            id: product.id || '',
            name: product.name || '',
            description: product.description || '',
            category: product.category || '',
            streams: product.streams || [],
            pricePerSecond: product.pricePerSecond || '0',
            ownerAddress: product.ownerAddress || '',
            beneficiaryAddress: product.beneficiaryAddress || '',
            previewConfigJson: product.previewConfigJson || '',
            previewStream: product.previewStream || '',
            state: product.state || productStates.NOT_DEPLOYED,
            isFree: product.isFree || BN(product.pricePerSecond || '0').isEqualTo(0),
            priceCurrency: product.priceCurrency || 'DATA',
            minimumSubscriptionInSeconds: product.minimumSubscriptionInSeconds || 0,
            owner: product.owner || '',
            imageUrl: product.imageUrl || '',
            thumbnailUrl: product.thumbnailUrl || '',
        }))
    }
}
export const initNewProduct = () => (dispatch: Function) => {
    dispatch(updateEditProduct({
        id: '',
        name: '',
        owner: '',
        description: '',
        imageUrl: '',
        thumbnailUrl: '',
        category: '',
        streams: [],
        previewStream: '',
        ownerAddress: '',
        beneficiaryAddress: '',
        pricePerSecond: '0',
        priceCurrency: 'DATA',
        previewConfigJson: '',
    }))
}

export const uploadImage = (id: ProductId, image: File) => (dispatch: Function) => {
    dispatch(imageUploadRequest(image))
    return api.postImage(id, image)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(imageUploadSuccess())
        }, (error) => {
            dispatch(imageUploadError(error))
        })
}

export const updateProduct = () => (dispatch: Function, getState: Function) => {
    dispatch(putEditProductRequest())
    const image = selectImageToUpload(getState())
    const editProduct = selectEditProduct(getState())

    return api.putProduct(editProduct, editProduct.id)
        .then((data) => {
            const { result, entities } = normalize(data, productSchema)
            dispatch(updateEntities(entities))
            if (image) {
                dispatch(uploadImage(editProduct.id || result, image))
            }
            dispatch(putEditProductSuccess())
            dispatch(showNotification(I18n.t('notification.productUpdated'), notificationIcons.CHECKMARK))
        }, (error) => {
            dispatch(putEditProductError(error))
        })
}

export const createProductAndRedirect = (redirectPath: (id: ProductId) => string) =>
    (dispatch: Function, getState: Function) => {
        dispatch(postProductRequest())

        const product = selectEditProduct(getState())
        const image = selectImageToUpload(getState())
        if (product) {
            return api.postProduct(product)
                .then((data) => {
                    const { result, entities } = normalize(data, productSchema)

                    dispatch(updateEntities(entities))
                    dispatch(postProductSuccess())
                    dispatch(resetEditProduct())

                    if (image) {
                        dispatch(uploadImage(result, image))
                    }

                    dispatch(push(redirectPath(result)))
                }, (error) => {
                    dispatch(postProductError(error))
                })
        }
        return null
    }

