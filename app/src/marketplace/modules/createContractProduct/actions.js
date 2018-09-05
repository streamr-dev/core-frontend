// @flow

import { createAction } from 'redux-actions'
import { getLocation } from 'react-router-redux'

import { setProductDeploying } from '../publish/actions'
import { showTransactionNotification } from '../notifications/actions'
import { getProductById } from '../product/actions'
import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { ProductId, SmartContractProduct } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'

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

const FIVE_SECONDS = 5000

const createContractProductRequest: ModifyProductActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_REQUEST,
    (productId: ProductId, product: SmartContractProduct) => ({
        productId,
        product,
    }),
)

const createContractProductSuccess: ReceiptActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_SUCCESS,
    (receipt: Receipt) => ({
        receipt,
    }),
)

const receiveCreateContractHash: HashActionCreator = createAction(
    RECEIVE_CREATE_CONTRACT_PRODUCT_HASH,
    (hash: Hash) => ({
        hash,
    }),
)

const createContractFailure: ModifyProductErrorActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const createContractProduct = (productId: ProductId, product: SmartContractProduct) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(createContractProductRequest(productId, product))

    return services
        .createContractProduct(product)
        .onTransactionHash((hash) => {
            dispatch(receiveCreateContractHash(hash))
            dispatch(showTransactionNotification(hash))
            dispatch(setProductDeploying(productId, hash))
        })
        .onTransactionComplete((receipt) => {
            // Call `getProductById()` with a timeout to allow the ethereum watcher to do its job.
            // At the moment, this the only way to get the UI to update after the transaction completes.
            setTimeout(() => {
                const location = getLocation(getState())

                // Do call only if we are still in product page.
                if (location.pathname.includes(productId)) {
                    dispatch(getProductById(productId))
                }
            }, FIVE_SECONDS)

            dispatch(createContractProductSuccess(receipt))
        })
        .onError((error) => dispatch(createContractFailure({
            message: error.message,
        })))
}
