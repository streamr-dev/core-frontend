// @flow

import { createAction } from 'redux-actions'

import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type {
    ModifyProductActionCreator,
    ModifyProductErrorActionCreator,
    HashActionCreator,
    ReceiptActionCreator,
} from '../createContractProduct/types'

import * as services from '../createContractProduct/services'
import {
    UPDATE_CONTRACT_PRODUCT_REQUEST,
    UPDATE_CONTRACT_PRODUCT_SUCCESS,
    UPDATE_CONTRACT_PRODUCT_FAILURE,
    RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
} from './constants'

const updateContractProductRequest: ModifyProductActionCreator = createAction(
    UPDATE_CONTRACT_PRODUCT_REQUEST,
    (productId: ProductId, product: SmartContractProduct) => ({
        productId,
        product,
    }),
)

const updateContractProductSuccess: ReceiptActionCreator = createAction(
    UPDATE_CONTRACT_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    }),
)

const receiveUpdateContractHash: HashActionCreator = createAction(
    RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const updateContractFailure: ModifyProductErrorActionCreator = createAction(
    UPDATE_CONTRACT_PRODUCT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const updateContractProduct = (productId: ProductId, product: SmartContractProduct) => (dispatch: Function) => {
    dispatch(updateContractProductRequest(productId, product))

    return services
        .updateContractProduct(product)
        .onTransactionHash((hash) => dispatch(receiveUpdateContractHash(hash)))
        .onTransactionComplete((receipt) => dispatch(updateContractProductSuccess(receipt)))
        .onError((error) => dispatch(updateContractFailure({
            message: error.message,
        })))
}
