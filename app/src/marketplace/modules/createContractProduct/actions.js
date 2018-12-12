// @flow

import { createAction } from 'redux-actions'
import { getLocation } from 'connected-react-router'

import { setProductDeploying } from '$mp/modules/publish/actions'
import { getProductById } from '$mp/modules/product/actions'
import type { Hash } from '$shared/flowtype/web3-types'
import type { ProductId, SmartContractProduct } from '$mp/flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { StoreState } from '$mp/flowtype/store-state'
import { addTransaction } from '$mp/modules/transactions/actions'
import { transactionTypes } from '$shared/utils/constants'

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
} from './types'

const FIVE_SECONDS = 5000

const createContractProductRequest: ModifyProductActionCreator = createAction(
    CREATE_CONTRACT_PRODUCT_REQUEST,
    (productId: ProductId) => ({
        productId,
    }),
)

const createContractProductSuccess: ReduxActionCreator = createAction(CREATE_CONTRACT_PRODUCT_SUCCESS)

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
    dispatch(createContractProductRequest(productId))

    return services
        .createContractProduct(product)
        .onTransactionHash((hash) => {
            dispatch(receiveCreateContractHash(hash))
            dispatch(addTransaction(hash, transactionTypes.CREATE_CONTRACT_PRODUCT))
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

            dispatch(createContractProductSuccess())
        })
        .onError((error) => dispatch(createContractFailure({
            message: error.message,
        })))
}
