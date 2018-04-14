// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import { productSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import * as services from './services'
import {
    DEPLOY_PRODUCT_REQUEST,
    RECEIVE_DEPLOY_PRODUCT_HASH,
    DEPLOY_PRODUCT_SUCCESS,
    DEPLOY_PRODUCT_FAILURE,
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
} from './constants'
import type {
    ProductIdActionCreator,
    PublishErrorActionCreator,
    HashActionCreator,
    ReceiptActionCreator,
} from './types'

export const deployProductRequest: ProductIdActionCreator = createAction(
    DEPLOY_PRODUCT_REQUEST,
    (productId: ProductId) => ({
        productId,
    }),
)

export const deployProductSuccess: ReceiptActionCreator = createAction(
    DEPLOY_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    }),
)

export const receiveDeployProductHash: HashActionCreator = createAction(
    RECEIVE_DEPLOY_PRODUCT_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const deployProductFailure: PublishErrorActionCreator = createAction(
    DEPLOY_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const postDeployFreeProductRequest: ProductIdActionCreator = createAction(
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const postDeployFreeProductSuccess: ProductIdActionCreator = createAction(
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

export const postDeployFreeProductFailure: PublishErrorActionCreator = createAction(
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const postUndeployFreeProductRequest: ProductIdActionCreator = createAction(
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const postUndeployFreeProductSuccess: ProductIdActionCreator = createAction(
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

export const postUndeployFreeProductFailure: PublishErrorActionCreator = createAction(
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const handleEntities = (schema: any, dispatch: Function) => (data) => {
    const { result, entities } = normalize(data, schema)
    dispatch(updateEntities(entities))
    return result
}

export const deployFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(postDeployFreeProductRequest(id))
    return services.postDeployFree(id)
        .then(handleEntities(productSchema, dispatch))
        .then(() => dispatch(postDeployFreeProductSuccess(id)))
        .catch((error) => dispatch(postDeployFreeProductFailure(id, {
            message: error.message,
        })))
}

export const undeployFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(postUndeployFreeProductRequest(id))
    return services.postUndeployFree(id)
        .then(handleEntities(productSchema, dispatch))
        .then(() => dispatch(postUndeployFreeProductSuccess(id)))
        .catch((error) => dispatch(postUndeployFreeProductFailure(id, error)))
}

export const redeployProduct = (productId: ProductId) => (dispatch: Function) => {
    dispatch(deployProductRequest(productId))

    return services
        .redeployProduct(productId)
        .onTransactionHash((hash) => dispatch(receiveDeployProductHash(hash)))
        .onTransactionComplete((receipt) => dispatch(deployProductSuccess(receipt)))
        .onError((error) => dispatch(deployProductFailure(productId, {
            message: error.message,
        })))
}

export const deleteProduct = (productId: ProductId) => (dispatch: Function) => {
    dispatch(deployProductRequest(productId))

    return services
        .deleteProduct(productId)
        .onTransactionHash((hash) => dispatch(receiveDeployProductHash(hash)))
        .onTransactionComplete((receipt) => dispatch(deployProductSuccess(receipt)))
        .onError((error) => dispatch(deployProductFailure(productId, {
            message: error.message,
        })))
}
