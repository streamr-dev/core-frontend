// @flow

import { createAction } from 'redux-actions'
import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH_SUCCESS,
    RECEIVE_PURCHASE_HASH_FAILURE,
} from './constants'
import type { PurchaseAction, PurchaseErrorAction, HashAction, HashErrorAction, ReceiptAction } from './types'
import type { PurchaseError, Hash, HashError, Receipt } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'
import * as services from './services'

export const buyProductRequest: PurchaseAction = createAction(
    BUY_PRODUCT_REQUEST,
    (productId: ProductId) => ({
        productId,
    })
)

export const buyProductSuccess: ReceiptAction = createAction(
    BUY_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    })
)

export const buyProductFailure: PurchaseErrorAction = createAction(
    BUY_PRODUCT_FAILURE,
    (error: PurchaseError, receipt: Receipt) => ({
        receipt,
        error,
    })
)

export const receiveHashSuccess: HashAction = createAction(
    RECEIVE_PURCHASE_HASH_SUCCESS,
    (hash: Hash) => ({
        hash,
    })
)

export const receiveHashFailure: HashErrorAction = createAction(
    RECEIVE_PURCHASE_HASH_FAILURE,
    (error: HashError) => ({
        error,
    })
)

export const buyProduct = (productId: ProductId) => (dispatch: Function) => {
    dispatch(buyProductRequest(productId))
    services
        .buyProduct(productId)
        .onTransactionHash(hash => {
            dispatch(receiveHashSuccess(hash))
        })
        .onTransactionComplete(receipt => {
            dispatch(buyProductSuccess(receipt))
        })
        .onError((error, receipt) => {
            dispatch(buyProductFailure(error, receipt))
        })
}
