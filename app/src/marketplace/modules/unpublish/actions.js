// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import { getLocation } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'

import Notification from '$shared/utils/Notification'
import { productSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import { NotificationIcon, transactionTypes } from '$shared/utils/constants'
import { addTransaction } from '$mp/modules/transactions/actions'
import { getProductById } from '$mp/modules/product/actions'
import type { Hash } from '$shared/flowtype/web3-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { StoreState } from '$mp/flowtype/store-state'
import type {
    PublishActionCreator,
    ProductIdActionCreator,
    PublishErrorActionCreator,
    HashActionCreator,
} from '$mp/modules/publish/types'

import * as services from './services'
import {
    UNDEPLOY_PRODUCT_REQUEST,
    RECEIVE_UNDEPLOY_PRODUCT_HASH,
    UNDEPLOY_PRODUCT_SUCCESS,
    UNDEPLOY_PRODUCT_FAILURE,
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
    SET_PRODUCT_UNDEPLOYING_REQUEST,
    SET_PRODUCT_UNDEPLOYING_SUCCESS,
    SET_PRODUCT_UNDEPLOYING_FAILURE,
} from './constants'

const FIVE_SECONDS = 5000

const deployProductRequest: PublishActionCreator = createAction(
    UNDEPLOY_PRODUCT_REQUEST,
    (productId: ProductId) => ({
        productId,
    }),
)

const deployProductSuccess: ReduxActionCreator = createAction(UNDEPLOY_PRODUCT_SUCCESS)

const receiveDeployProductHash: HashActionCreator = createAction(
    RECEIVE_UNDEPLOY_PRODUCT_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const deployProductFailure: PublishErrorActionCreator = createAction(
    UNDEPLOY_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const postUndeployFreeProductRequest: ProductIdActionCreator = createAction(
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const postUndeployFreeProductSuccess: ProductIdActionCreator = createAction(
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

const postUndeployFreeProductFailure: PublishErrorActionCreator = createAction(
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const setProductDeployingRequest: ProductIdActionCreator = createAction(
    SET_PRODUCT_UNDEPLOYING_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const setProductDeployingSuccess: ProductIdActionCreator = createAction(
    SET_PRODUCT_UNDEPLOYING_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

const setProductDeployingFailure: PublishErrorActionCreator = createAction(
    SET_PRODUCT_UNDEPLOYING_FAILURE,
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

export const undeployFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(postUndeployFreeProductRequest(id))
    return services.postUndeployFree(id)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(postUndeployFreeProductSuccess(id))
            Notification.push({
                title: I18n.t('notifications.productUnpublished'),
                icon: NotificationIcon.CHECKMARK,
            })
        }, (error) => {
            dispatch(postUndeployFreeProductFailure(id, {
                message: error.message,
            }))
        })
}

export const setProductUndeploying = (id: ProductId, txHash: Hash) => (dispatch: Function) => {
    dispatch(setProductDeployingRequest(id))
    return services.postSetUndeploying(id, txHash)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(setProductDeployingSuccess(id))
        }, (error) => {
            dispatch(setProductDeployingFailure(id, {
                message: error.message,
            }))
        })
}

export const deleteProduct = (productId: ProductId) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(deployProductRequest(productId))

    return services
        .deleteProduct(productId)
        .onTransactionHash((hash) => {
            dispatch(receiveDeployProductHash(hash))
            dispatch(addTransaction(hash, transactionTypes.UNDEPLOY_PRODUCT))
            dispatch(setProductUndeploying(productId, hash))
        })
        .onTransactionComplete(() => {
            // Call `getProductById()` with a timeout to allow the ethereum watcher to do its job.
            // At the moment, this the only way to get the UI to update after the transaction completes.
            setTimeout(() => {
                const location = getLocation(getState())

                // Do call only if we are still in product page.
                if (location.pathname.includes(productId)) {
                    dispatch(getProductById(productId))
                }
            }, FIVE_SECONDS)

            dispatch(deployProductSuccess())
        })
        .onError((error) => dispatch(deployProductFailure(productId, {
            message: error.message,
        })))
}
