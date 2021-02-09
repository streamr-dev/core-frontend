// @flow

import { createAction } from 'redux-actions'

import { contractProductSchema } from '$shared/modules/entities/schema'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import type { Address } from '$shared/flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'

import {
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    SET_WHITELISTED_ADDRESSES,
    ADD_WHITELISTED_ADDRESS,
    REMOVE_WHITELISTED_ADDRESS,
    CLEAR_CONTRACT_PRODUCT,
} from './constants'
import * as services from './services'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
    WhiteListedAddressActionCreator,
    WhiteListedAddressesActionCreator,
} from './types'

const getProductFromContractRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getProductFromContractSuccess: ProductIdActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    (id: ProductId) => ({
        id,
    }),
)

const getProductFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const setWhiteListedAddresses: WhiteListedAddressesActionCreator = createAction(
    SET_WHITELISTED_ADDRESSES,
    (id: ProductId, addresses: Array<Address>) => ({
        id,
        addresses,
    }),
)

export const addWhiteListedAddress: WhiteListedAddressActionCreator = createAction(
    ADD_WHITELISTED_ADDRESS,
    (id: ProductId, address: Address) => ({
        id,
        address,
    }),
)

export const removeWhiteListedAddress: WhiteListedAddressActionCreator = createAction(
    REMOVE_WHITELISTED_ADDRESS,
    (id: ProductId, address: Address) => ({
        id,
        address,
    }),
)

export const getProductFromContract = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductFromContractRequest(id))
    return services
        .getProductFromContract(id)
        .then((data) => handleEntities(contractProductSchema, dispatch)({
            id,
            ...data,
        }))
        .then((result) => {
            dispatch(getProductFromContractSuccess(result))
        }, (error) => {
            dispatch(getProductFromContractFailure(id, {
                message: error.message,
            }))
        })
}

export const loadSubscriptionDataFromContract = (id: ProductId) => async (dispatch: Function) => {
    const subscriberCount = await services.getSubscriberCount(id)
    const purchaseTimestamp = await services.getMostRecentPurchaseTimestamp(id)

    return handleEntities(contractProductSchema, dispatch)({
        id,
        subscriberCount,
        purchaseTimestamp,
    })
}

export const clearContractProduct: ReduxActionCreator = createAction(CLEAR_CONTRACT_PRODUCT)
