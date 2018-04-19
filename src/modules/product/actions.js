// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import { productSchema, streamsSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import { showNotification } from '../notifications/actions'
import type { StreamIdList } from '../../flowtype/stream-types'
import type { ProductId, Subscription } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'

import { selectProduct } from './selectors'
import {
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
} from './constants'
import * as services from './services'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
    StreamIdsByProductIdActionCreator,
    ProductSubscriptionActionCreator,
} from './types'

export const getProductByIdRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_BY_ID_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const getProductByIdSuccess: ProductIdActionCreator = createAction(
    GET_PRODUCT_BY_ID_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

export const getProductByIdFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_BY_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const getStreamsByProductIdRequest: ProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const getStreamsByProductIdSuccess: StreamIdsByProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    (id: ProductId, streams: StreamIdList) => ({
        id,
        streams,
    }),
)

export const getStreamsByProductIdFailure: ProductErrorActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const getProductFromContractRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const getProductFromContractSuccess: ProductIdActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

export const getProductFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const getProductSubscriptionFromContractRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const getProductSubscriptionFromContractSuccess: ProductSubscriptionActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    (id: ProductId, subscription: Subscription) => ({
        id,
        subscription,
    }),
)

export const getProductSubscriptionFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
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

export const postDeployFreeProductFailure: ProductErrorActionCreator = createAction(
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

export const postUndeployFreeProductFailure: ProductErrorActionCreator = createAction(
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

export const publishFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(postDeployFreeProductRequest(id))
    return services.postDeployFree(id)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(postDeployFreeProductSuccess(id))
            dispatch(showNotification('Your product has been published'))
        })
        .catch((error) => dispatch(postDeployFreeProductFailure(id, error)))
}

export const unpublishFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(postUndeployFreeProductRequest(id))
    return services.postUndeployFree(id)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(postUndeployFreeProductSuccess(id))
            dispatch(showNotification('Your product has been unpublished'))
        })
        .catch((error) => dispatch(postUndeployFreeProductFailure(id, error)))
}

export const getStreamsByProductId = (id: ProductId) => (dispatch: Function) => {
    dispatch(getStreamsByProductIdRequest(id))
    return services
        .getStreamsByProductId(id)
        .then(handleEntities(streamsSchema, dispatch))
        .then((result) => dispatch(getStreamsByProductIdSuccess(id, result)))
        .catch((error) => dispatch(getStreamsByProductIdFailure(id, error)))
}

const fetchProductStreams = (id: ProductId, getState: () => StoreState, dispatch: Function) => () => {
    const product = selectProduct(getState())
    if (product && product.streams) {
        dispatch(getStreamsByProductId(id))
    }
}

export const getProductById = (id: ProductId) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getProductByIdRequest(id))
    return services
        .getProductById(id)
        .then(handleEntities(productSchema, dispatch))
        .then((result) => dispatch(getProductByIdSuccess(result)))
        .then(fetchProductStreams(id, getState, dispatch))
        .catch((error) => dispatch(getProductByIdFailure(id, error)))
}

export const getProductFromContract = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductFromContractRequest(id))
    return services
        .getProductFromContract(id)
        .then(handleEntities(productSchema, dispatch))
        .then((result) => dispatch(getProductFromContractSuccess(result)))
        .catch((error) => dispatch(getProductFromContractFailure(id, error)))
}

export const getProductSubscription = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductSubscriptionFromContractRequest(id))
    return services
        .getMyProductSubscription(id)
        .then((result) => dispatch(getProductSubscriptionFromContractSuccess(id, result)))
        .catch((error) => {
            dispatch(getProductSubscriptionFromContractFailure(id, {
                message: error.message,
            }))
        })
}
