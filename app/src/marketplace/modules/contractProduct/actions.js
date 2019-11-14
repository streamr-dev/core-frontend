// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import { contractProductSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'

import {
    GET_PRODUCT_FROM_CONTRACT_FAILURE,
    GET_PRODUCT_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_FROM_CONTRACT_SUCCESS,
    CLEAR_CONTRACT_PRODUCT,
} from './constants'
import * as services from './services'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
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

const handleEntities = (id: ProductId, schema: any, dispatch: Function) => (data) => {
    // id is not returned in the smart contract response so add it here to help the normalizing
    const { result, entities } = normalize({
        id,
        ...data,
    }, schema)
    dispatch(updateEntities(entities))
    return result
}

export const getProductFromContract = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductFromContractRequest(id))
    return services
        .getProductFromContract(id)
        .then(handleEntities(id, contractProductSchema, dispatch))
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
    const purchaseTimestamp = await services.getMostRecentPurchase(id)

    const { entities } = normalize({
        id,
        subscriberCount,
        purchaseTimestamp,
    }, contractProductSchema)

    return dispatch(updateEntities(entities))
}

export const clearContractProduct: ReduxActionCreator = createAction(CLEAR_CONTRACT_PRODUCT)
