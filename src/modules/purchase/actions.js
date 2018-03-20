// @flow

import { createAction } from 'redux-actions'
import {
    BUY_PRODUCT_REQUEST,
    BUY_PRODUCT_SUCCESS,
    BUY_PRODUCT_FAILURE,
    RECEIVE_PURCHASE_HASH_SUCCESS,
    RECEIVE_PURCHASE_HASH_FAILURE,
} from './constants'
import type { PurchaseAction, PurchaseErrorAction, TxHashAction, TxHashErrorAction } from './types'
import type { PurchaseError, TxHash, TxHashError, Receipt } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'
import * as services from './services'

export const buyProductRequest: PurchaseAction = createAction(
    BUY_PRODUCT_REQUEST,
    (id: ProductId) => ({
        id,
    })
)

export const buyProductSuccess: PurchaseAction = createAction(
    BUY_PRODUCT_SUCCESS,
    (id: ProductId, receipt: Receipt) => ({
        id,
        receipt,
    })
)

export const buyProductFailure: PurchaseErrorAction = createAction(
    BUY_PRODUCT_FAILURE,
    (id: ProductId, error: PurchaseError, receipt: Receipt) => ({
        id,
        receipt,
        error,
    })
)

export const receiveTxHashSuccess: TxHashAction = createAction(
    RECEIVE_PURCHASE_HASH_SUCCESS,
    (id: ProductId, hash: TxHash) => ({
        id,
        hash,
    })
)

export const receiveTxHashFailure: TxHashErrorAction = createAction(
    RECEIVE_PURCHASE_HASH_FAILURE,
    (id: ProductId, error: TxHashError) => ({
        id,
        error,
    })
)

export const buyProduct = (id: ProductId) => (dispatch: Function) => {
    dispatch(buyProductRequest(id))
    services
        .buyProduct(id)
        .onTransactionHash(hash => {
            dispatch(receiveTxHashSuccess(id, hash))
        })
        .onTransactionMined(receipt => {
            dispatch(buyProductSuccess(id, receipt))
        })
        .onError((error, receipt) => {
            dispatch(buyProductFailure(id, error, receipt))
        })
}
