// @flow

import type BN from 'bignumber.js'
import { createAction } from 'redux-actions'
import moment from 'moment'
import { getLocation } from 'connected-react-router'
import { I18n } from 'react-redux-i18n'

import Notification from '$shared/utils/Notification'
import type { ErrorFromApi, NumberString, ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { Hash } from '$shared/flowtype/web3-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { NotificationIcon, transactionTypes } from '$shared/utils/constants'
import { getMyPurchases } from '../myPurchaseList/actions'
import { getProductSubscription } from '../product/actions'
import { addTransaction } from '../transactions/actions'

import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH,
    ADD_FREE_PRODUCT_REQUEST,
    ADD_FREE_PRODUCT_SUCCESS,
    ADD_FREE_PRODUCT_FAILURE,
} from './constants'
import type {
    PurchaseActionCreator,
    PurchaseErrorActionCreator,
    HashActionCreator,
    ProductIdActionCreator,
    ProductErrorActionCreator,
} from './types'
import * as services from './services'

const FIVE_SECONDS = 5000

const buyProductRequest: PurchaseActionCreator = createAction(
    BUY_PRODUCT_REQUEST,
    (productId: ProductId, subscriptionInSeconds: NumberString) => ({
        productId,
        subscriptionInSeconds,
    }),
)

const buyProductSuccess: ReduxActionCreator = createAction(BUY_PRODUCT_SUCCESS)

const receivePurchaseHash: HashActionCreator = createAction(
    RECEIVE_PURCHASE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const buyProductFailure: PurchaseErrorActionCreator = createAction(
    BUY_PRODUCT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

const addFreeProductRequest: ProductIdActionCreator = createAction(
    ADD_FREE_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const addFreeProductSuccess: ReduxActionCreator = createAction(ADD_FREE_PRODUCT_SUCCESS)

const addFreeProductFailure: ProductErrorActionCreator = createAction(
    ADD_FREE_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorFromApi) => ({
        id,
        error,
    }),
)

export const buyProduct = (productId: ProductId, subscriptionInSeconds: NumberString | BN) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(buyProductRequest(productId, subscriptionInSeconds.toString()))

    return services
        .buyProduct(productId, subscriptionInSeconds)
        .onTransactionHash((hash) => {
            dispatch(receivePurchaseHash(hash))
            dispatch(addTransaction(hash, transactionTypes.PURCHASE))
        })
        .onTransactionComplete(() => {
            dispatch(buyProductSuccess())

            // Call `getProductSubscription()` with a timeout to allow the ethereum watcher to do its job.
            // At the moment, this the only way to get the UI to update after the transaction completes.
            setTimeout(() => {
                const location = getLocation(getState())

                // Do call only if we are still in product page.
                if (location.pathname.includes(productId)) {
                    dispatch(getProductSubscription(productId))
                }
            }, FIVE_SECONDS)
        })
        .onError((error) => {
            dispatch(buyProductFailure({
                message: error.message,
            }))
        })
}

export const addFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(addFreeProductRequest(id))

    // subscribe for one year (TODO: move to constant)
    const endsAt = moment().add(1, 'year').unix() // Unix timestamp (seconds)

    return services
        .addFreeProduct(id, endsAt)
        .then(
            () => {
                dispatch(addFreeProductSuccess())
                Notification.push({
                    title: I18n.t('notifications.productSaved'),
                    icon: NotificationIcon.CHECKMARK,
                })
                dispatch(getMyPurchases())
            },
            (error) => dispatch(addFreeProductFailure(id, {
                message: error.message,
            })),
        )
}
