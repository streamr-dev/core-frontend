// @flow

import { createAction } from 'redux-actions'
import { getLocation } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'

import Notification from '$shared/utils/Notification'
import { productSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { NotificationIcon, transactionTypes } from '$shared/utils/constants'
import { getProductById } from '$mp/modules/product/actions'
import type { Hash } from '$shared/flowtype/web3-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { StoreState } from '$mp/flowtype/store-state'
import { addTransaction } from '$mp/modules/transactions/actions'

import * as services from './services'
import {
    DEPLOY_PRODUCT_REQUEST,
    RECEIVE_DEPLOY_PRODUCT_HASH,
    DEPLOY_PRODUCT_SUCCESS,
    DEPLOY_PRODUCT_FAILURE,
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    SET_PRODUCT_DEPLOYING_REQUEST,
    SET_PRODUCT_DEPLOYING_SUCCESS,
    SET_PRODUCT_DEPLOYING_FAILURE,
} from './constants'
import type {
    PublishActionCreator,
    ProductIdActionCreator,
    PublishErrorActionCreator,
    HashActionCreator,
} from './types'

const FIVE_SECONDS = 5000

const deployProductRequest: PublishActionCreator = createAction(
    DEPLOY_PRODUCT_REQUEST,
    (productId: ProductId) => ({
        productId,
    }),
)

const deployProductSuccess: ReduxActionCreator = createAction(DEPLOY_PRODUCT_SUCCESS)

const receiveDeployProductHash: HashActionCreator = createAction(
    RECEIVE_DEPLOY_PRODUCT_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const deployProductFailure: PublishErrorActionCreator = createAction(
    DEPLOY_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const postDeployFreeProductRequest: ProductIdActionCreator = createAction(
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const postDeployFreeProductSuccess: ProductIdActionCreator = createAction(
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

const postDeployFreeProductFailure: PublishErrorActionCreator = createAction(
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const setProductDeployingRequest: ProductIdActionCreator = createAction(
    SET_PRODUCT_DEPLOYING_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const setProductDeployingSuccess: ProductIdActionCreator = createAction(
    SET_PRODUCT_DEPLOYING_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

const setProductDeployingFailure: PublishErrorActionCreator = createAction(
    SET_PRODUCT_DEPLOYING_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const deployFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(postDeployFreeProductRequest(id))
    return services.postDeployFree(id)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(postDeployFreeProductSuccess(id))
            Notification.push({
                title: I18n.t('notifications.productPublished'),
                icon: NotificationIcon.CHECKMARK,
            })
        }, (error) => {
            dispatch(postDeployFreeProductFailure(id, {
                message: error.message,
            }))
        })
}

export const setProductDeploying = (id: ProductId, txHash: Hash) => (dispatch: Function) => {
    dispatch(setProductDeployingRequest(id))
    return services.postSetDeploying(id, txHash)
        .then(handleEntities(productSchema, dispatch))
        .then(() => {
            dispatch(setProductDeployingSuccess(id))
        }, (error) => {
            dispatch(setProductDeployingFailure(id, {
                message: error.message,
            }))
        })
}

export const redeployProduct = (productId: ProductId) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(deployProductRequest(productId))

    return services
        .redeployProduct(productId)
        .onTransactionHash((hash) => {
            dispatch(receiveDeployProductHash(hash))
            dispatch(addTransaction(hash, transactionTypes.REDEPLOY_PRODUCT))
            dispatch(setProductDeploying(productId, hash))
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
