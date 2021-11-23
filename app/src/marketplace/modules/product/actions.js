// @flow

import { createAction } from 'redux-actions'

import { streamsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import type { StreamIdList } from '$shared/flowtype/stream-types'
import type { ReduxActionCreator, ErrorInUi } from '$shared/flowtype/common-types'
import { getMyPurchases } from '../myPurchaseList/actions'
import type { ProductId, Subscription } from '../../flowtype/product-types'

import {
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
    RESET_PRODUCT,
} from './constants'
import * as services from './services'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
    StreamIdsByProductIdActionCreator,
    ProductSubscriptionActionCreator,
} from './types'

const getStreamsByProductIdRequest: ProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getStreamsByProductIdSuccess: StreamIdsByProductIdActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    (id: ProductId, streams: StreamIdList) => ({
        id,
        streams,
    }),
)

const getStreamsByProductIdFailure: ProductErrorActionCreator = createAction(
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

const getProductSubscriptionFromContractRequest: ProductIdActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getProductSubscriptionFromContractSuccess: ProductSubscriptionActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    (id: ProductId, subscription: Subscription) => ({
        id,
        subscription,
    }),
)

const getProductSubscriptionFromContractFailure: ProductErrorActionCreator = createAction(
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const resetProduct: ReduxActionCreator = createAction(RESET_PRODUCT)

export const getStreamsByProductId = (id: ProductId, useAuthorization: boolean = true) => (dispatch: Function) => {
    dispatch(getStreamsByProductIdRequest(id))
    return services
        .getStreamsByProductId(id, useAuthorization)
        .then(handleEntities(streamsSchema, dispatch))
        .then(
            (result) => dispatch(getStreamsByProductIdSuccess(id, result)),
            (error) => dispatch(getStreamsByProductIdFailure(id, error)),
        )
}

export const getProductSubscription = (id: ProductId) => (dispatch: Function) => {
    dispatch(getProductSubscriptionFromContractRequest(id))
    return dispatch(getMyPurchases())
        .then(() => (
            services
                .getMyProductSubscription(id)
                .then(
                    (result) => dispatch(getProductSubscriptionFromContractSuccess(id, result)),
                    (error) => dispatch(getProductSubscriptionFromContractFailure(id, {
                        message: error.message,
                    })),
                )
        ))
}
