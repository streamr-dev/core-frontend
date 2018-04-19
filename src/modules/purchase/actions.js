// @flow

import { createAction } from 'redux-actions'

import type { ErrorFromApi, ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'

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
    ReceiptActionCreator,
    ProductIdActionCreator,
    ProductErrorActionCreator,
} from './types'
import * as services from './services'

export const buyProductRequest: PurchaseActionCreator = createAction(
    BUY_PRODUCT_REQUEST,
    (productId: ProductId, subscriptionInSeconds: number) => ({
        productId,
        subscriptionInSeconds,
    }),
)

export const buyProductSuccess: ReceiptActionCreator = createAction(
    BUY_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    }),
)

export const receivePurchaseHash: HashActionCreator = createAction(
    RECEIVE_PURCHASE_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const buyProductFailure: PurchaseErrorActionCreator = createAction(
    BUY_PRODUCT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const addFreeProductRequest: ProductIdActionCreator = createAction(
    ADD_FREE_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const addFreeProductSuccess: ReduxActionCreator = createAction(ADD_FREE_PRODUCT_SUCCESS)

export const addFreeProductFailure: ProductErrorActionCreator = createAction(
    ADD_FREE_PRODUCT_FAILURE,
    (id: ProductId, error: ErrorFromApi) => ({
        id,
        error,
    }),
)

export const buyProduct = (productId: ProductId, subscriptionInSeconds: number) => (dispatch: Function) => {
    dispatch(buyProductRequest(productId, subscriptionInSeconds))

    return services
        .buyProduct(productId, subscriptionInSeconds)
        .onTransactionHash((hash) => dispatch(receivePurchaseHash(hash)))
        .onTransactionComplete((receipt) => dispatch(buyProductSuccess(receipt)))
        .onError((error) => dispatch(buyProductFailure({
            message: error.message,
        })))
}

export const addFreeProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(addFreeProductRequest(id))

    // subscribe for one year (TODO: move to constant)
    const today = new Date()
    const endsAt = Math.floor(new Date().setFullYear(today.getFullYear() + 1) / 1000)

    return services
        .addFreeProduct(id, endsAt)
        .then(() => dispatch(addFreeProductSuccess()))
        .catch((error) => dispatch(addFreeProductFailure(id, {
            message: error.message,
        })))
}
