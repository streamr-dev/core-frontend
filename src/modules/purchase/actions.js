// @flow

import { createAction } from 'redux-actions'
import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH,
} from './constants'
import type { PurchaseActionCreator, PurchaseErrorActionCreator, HashActionCreator, ReceiptActionCreator } from './types'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'
import * as services from '../product/services'
import type TransactionError from '../../errors/TransactionError'

export const buyProductRequest: PurchaseActionCreator = createAction(
    BUY_PRODUCT_REQUEST,
    (productId: ProductId, subscriptionInSeconds: number) => ({
        productId,
        subscriptionInSeconds,
    })
)

export const buyProductSuccess: ReceiptActionCreator = createAction(
    BUY_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    })
)

export const receivePurchaseHash: HashActionCreator = createAction(
    RECEIVE_PURCHASE_HASH,
    (hash: Hash) => ({
        hash,
    })
)

export const buyProductFailure: PurchaseErrorActionCreator = createAction(
    BUY_PRODUCT_FAILURE,
    (error: TransactionError) => ({
        error,
    })
)

export const buyProduct = (productId: ProductId, subscriptionInSeconds: number) => (dispatch: Function) => {
    dispatch(buyProductRequest(productId, subscriptionInSeconds))

    return services
        .buyProduct(productId, subscriptionInSeconds)
        .onTransactionHash(hash => dispatch(receivePurchaseHash(hash)))
        .onTransactionComplete(receipt => dispatch(buyProductSuccess(receipt)))
        .onError(error => dispatch(buyProductFailure(error)))
}
