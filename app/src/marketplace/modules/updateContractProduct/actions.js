// @flow

import { createAction } from 'redux-actions'

import type { Hash } from '../../flowtype/web3-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import type {
    ModifyProductActionCreator,
    ModifyProductErrorActionCreator,
    HashActionCreator,
} from '../createContractProduct/types'
import { addTransaction } from '../transactions/actions'
import { transactionTypes } from '../../utils/constants'

import * as services from '../createContractProduct/services'
import {
    UPDATE_CONTRACT_PRODUCT_REQUEST,
    UPDATE_CONTRACT_PRODUCT_SUCCESS,
    UPDATE_CONTRACT_PRODUCT_FAILURE,
    RECEIVE_UPDATE_CONTRACT_PRODUCT_HASH,
    UPDATE_CONTRACT_PRODUCT_RESET,
} from './constants'

const updateContractProductRequest: ModifyProductActionCreator = createAction(
    UPDATE_CONTRACT_PRODUCT_REQUEST,
    (productId: ProductId) => ({
        productId,
    }),
)

const updateContractProductSuccess: ReduxActionCreator = createAction(UPDATE_CONTRACT_PRODUCT_SUCCESS)

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

export const resetUpdateContractProductTransaction: ReduxActionCreator = createAction(UPDATE_CONTRACT_PRODUCT_RESET)

export const updateContractProduct = (productId: ProductId, product: SmartContractProduct) => (dispatch: Function) => {
    dispatch(updateContractProductRequest(productId))

    return services
        .updateContractProduct(product)
        .onTransactionHash((hash) => {
            dispatch(receiveUpdateContractHash(hash))
            dispatch(addTransaction(hash, transactionTypes.UPDATE_CONTRACT_PRODUCT))
        })
        .onTransactionComplete(() => dispatch(updateContractProductSuccess()))
        .onError((error) => dispatch(updateContractFailure({
            message: error.message,
        })))
}
