// @flow

import { createAction } from 'redux-actions'
import { replace } from 'react-router-redux'

import { productSchema, streamsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { formatPath } from '$shared/utils/url'
import links from '../../../links'
import { addFreeProduct } from '../purchase/actions'
import { isPaidProduct } from '../../utils/product'
import { getMyPurchases } from '../myPurchaseList/actions'
import type { StreamIdList } from '$shared/flowtype/stream-types'
import type { ProductId, Subscription } from '../../flowtype/product-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'

import { selectProduct } from './selectors'
import {
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
} from './constants'
import * as services from './services'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
    StreamIdsByProductIdActionCreator,
    ProductSubscriptionActionCreator,
} from './types'

const getProductByIdRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_BY_ID_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getProductByIdSuccess: ProductIdActionCreator = createAction(
    GET_PRODUCT_BY_ID_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

const getProductByIdFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_BY_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const getStreamsByProductIdRequest: ProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getStreamsByProductIdSuccess: StreamIdsByProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    (id: ProductId, streams: StreamIdList) => ({
        id,
        streams,
    }),
)

const getStreamsByProductIdFailure: ProductErrorActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const getProductSubscriptionFromContractRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getProductSubscriptionFromContractSuccess: ProductSubscriptionActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    (id: ProductId, subscription: Subscription) => ({
        id,
        subscription,
    }),
)

const getProductSubscriptionFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const getUserProductPermissionsRequest: ProductIdActionCreator = createAction(
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getUserProductPermissionsSuccess = createAction(
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    (read: boolean, write: boolean, share: boolean) => ({
        read,
        write,
        share,
    }),
)

const getUserProductPermissionsFailure: ProductErrorActionCreator = createAction(
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const getStreamsByProductId = (id: ProductId) => (dispatch: Function) => {
    dispatch(getStreamsByProductIdRequest(id))
    return services
        .getStreamsByProductId(id)
        .then(handleEntities(streamsSchema, dispatch))
        .then(
            (result) => dispatch(getStreamsByProductIdSuccess(id, result)),
            (error) => dispatch(getStreamsByProductIdFailure(id, error)),
        )
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
        .then(
            (result) => dispatch(getProductByIdSuccess(result)),
            (error) => dispatch(getProductByIdFailure(id, {
                message: error.message,
                statusCode: error.statusCode,
                code: error.code,
            })),
        )
        .then(fetchProductStreams(id, getState, dispatch))
}

export const getProductSubscription = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductSubscriptionFromContractRequest(id))
    return dispatch(getMyPurchases())
        .then(() => (
            services
                .getMyProductSubscription(id)
                .then(
                    (result) => dispatch(getProductSubscriptionFromContractSuccess(id, result)),
                    (error) => dispatch(getProductSubscriptionFromContractFailure(id, {
                        message: error.message,
                    })),
                )
        ))
}

export const purchaseProduct = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectProduct(state)

    if (product) {
        if (isPaidProduct(product)) {
            // Paid product has to be bought with Metamask
            dispatch(replace(formatPath(links.marketplace.products, product.id || '', 'purchase')))
        } else {
            // Free product can be bought directly
            dispatch(addFreeProduct(product.id || ''))
        }
    }
}

export const getUserProductPermissions = (id: ProductId) => (dispatch: Function) => {
    dispatch(getUserProductPermissionsRequest(id))
    return services
        .getUserProductPermissions(id)
        .then((result) => {
            const p = result.reduce((permissions, permission) => {
                if (permission.anonymous) {
                    return {
                        ...permissions,
                        read: true,
                    }
                }
                if (!permission.operation) {
                    return permissions
                }
                return {
                    ...permissions,
                    [permission.operation]: true,
                }
            }, {})
            const canRead = !!p.read || false
            const canWrite = !!p.write || false
            const canShare = !!p.share || false
            dispatch(getUserProductPermissionsSuccess(canRead, canWrite, canShare))
        }, (error) => {
            dispatch(getUserProductPermissionsFailure(id, {
                message: error.message,
            }))
        })
}
