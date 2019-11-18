// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import BN from 'bignumber.js'
import { push } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'

import Notification from '$shared/utils/Notification'
import { handleEntities } from '$shared/utils/entities'
import { selectProduct } from '$mp/modules/product/selectors'
import { productSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import { NotificationIcon, productStates } from '$shared/utils/constants'
import type { EditProduct, ProductId } from '$mp/flowtype/product-types'
import type { ErrorFromApi, ReduxActionCreator } from '$shared/flowtype/common-types'

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
    PUT_PRODUCT_RESET,
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
const postProductRequest: ReduxActionCreator = createAction(POST_PRODUCT_REQUEST)

const postProductSuccess: ReduxActionCreator = createAction(POST_PRODUCT_SUCCESS)

const postProductError: EditProductErrorActionCreator = createAction(
    POST_PRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    }),
)

export const setImageToUpload: ImageActionCreator = createAction(IMAGE_UPLOAD_SET_IMAGE, (image: File) => ({
    image,
}))

const imageUploadRequest: ImageActionCreator = createAction(IMAGE_UPLOAD_REQUEST, (image: File) => ({
    image,
}))

const imageUploadSuccess: ImageResultActionCreator = createAction(IMAGE_UPLOAD_SUCCESS)

const imageUploadError: ImageErrorActionCreator = createAction(IMAGE_UPLOAD_FAILURE, (error: ErrorFromApi) => ({
    error,
}))

export const resetEditProduct: ReduxActionCreator = createAction(RESET_PRODUCT)

const putEditProductRequest: ReduxActionCreator = createAction(PUT_PRODUCT_REQUEST)

const putEditProductSuccess: ReduxActionCreator = createAction(PUT_PRODUCT_SUCCESS)

const putEditProductError: EditProductErrorActionCreator = createAction(
    PUT_PRODUCT_FAILURE,
    (error: ErrorFromApi) => ({
        error,
    }),
)

export const resetUpdateProductTransaction: ReduxActionCreator = createAction(PUT_PRODUCT_RESET)

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

export const updateProduct = (addNotification: boolean = true) => (dispatch: Function, getState: Function) => {
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

            if (addNotification) {
                Notification.push({
                    title: I18n.t('notifications.productUpdated'),
                    icon: NotificationIcon.CHECKMARK,
                })
            }
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

