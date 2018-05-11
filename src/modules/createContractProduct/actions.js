// @flow

import { createAction } from 'redux-actions'

import { setProductDeploying } from '../publish/actions'
import { showTransactionNotification } from '../notifications/actions'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import * as services from './services'
import {
    CREATE_CONTRACT_PRODUCT_REQUEST,
    CREATE_CONTRACT_PRODUCT_SUCCESS,
    RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
    CREATE_CONTRACT_PRODUCT_FAILURE,
} from './constants'
import type {
    ModifyProductActionCreator,
    ModifyProductErrorActionCreator,
    HashActionCreator,
    ReceiptActionCreator,
} from './types'

export const createContractProductRequest: ModifyProductActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_REQUEST,
    (productId: ProductId, product: SmartContractProduct) => ({
        productId,
        product,
    }),
)

export const createContractProductSuccess: ReceiptActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    }),
)

export const receiveCreateContractHash: HashActionCreator = createAction(
    RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

export const createContractFailure: ModifyProductErrorActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const createContractProduct = (productId: ProductId, product: SmartContractProduct) => (dispatch: Function) => {
    dispatch(createContractProductRequest(productId, product))

    return services
        .createContractProduct(product)
        .onTransactionHash((hash) => {
            dispatch(receiveCreateContractHash(hash))
            dispatch(showTransactionNotification(hash))
            dispatch(setProductDeploying(productId, hash))
        })
        .onTransactionComplete((receipt) => dispatch(createContractProductSuccess(receipt)))
        .onError((error) => dispatch(createContractFailure({
            message: error.message,
        })))
}
