// @flow

import { handleActions } from 'redux-actions'

import type { ProductState } from '../../flowtype/store-state'

import {
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
} from './constants'
import type {
    ProductErrorAction,
    ProductSubscriptionAction,
} from './types'

export const initialState: ProductState = {
    fetchingContractSubscription: false,
    contractSubscriptionError: null,
    contractSubscription: null,
}

const reducer: (ProductState) => ProductState = handleActions({
    [GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST]: (state: ProductState) => ({
        ...state,
        fetchingContractSubscription: true,
    }),

    [GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS]: (state: ProductState, action: ProductSubscriptionAction) => ({
        ...state,
        fetchingContractSubscription: false,
        contractSubscription: action.payload.subscription,
    }),

    [GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE]: (state: ProductState, action: ProductErrorAction) => ({
        ...state,
        fetchingContractSubscription: false,
        contractSubscription: null,
        contractSubscriptionError: action.payload.error,
    }),
}, initialState)

export default reducer
