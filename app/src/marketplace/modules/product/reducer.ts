import { handleActions } from 'redux-actions'
import type { ProductState } from '../../types/store-state'
import {
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
} from './constants'
import type { ProductErrorAction, ProductSubscriptionAction } from './types'
export const initialState: ProductState = {
    fetchingContractSubscription: false,
    contractSubscriptionError: null,
    contractSubscription: null,
}
export type ProductStateActionPayloads = ProductSubscriptionAction['payload'] | ProductErrorAction['payload'] | object
const reducer = handleActions<ProductState, ProductStateActionPayloads>(
    {
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
    },
    initialState,
)
export default reducer
