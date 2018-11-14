// @flow

import { handleActions } from 'redux-actions'

import type { ProductState } from '../../flowtype/store-state'

import {
    GET_PRODUCT_BY_ID_REQUEST,
    GET_PRODUCT_BY_ID_SUCCESS,
    GET_PRODUCT_BY_ID_FAILURE,
    GET_STREAMS_BY_PRODUCT_ID_REQUEST,
    GET_STREAMS_BY_PRODUCT_ID_SUCCESS,
    GET_STREAMS_BY_PRODUCT_ID_FAILURE,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_REQUEST,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_SUCCESS,
    GET_PRODUCT_SUBSCRIPTION_FROM_CONTRACT_FAILURE,
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
} from './constants'
import type {
    ProductIdAction,
    ProductErrorAction,
    StreamIdsByProductIdAction,
    ProductSubscriptionAction,
    UserProductPermissionsIdAction,
} from './types'

export const initialState: ProductState = {
    id: null,
    fetchingProduct: false,
    productError: null,
    streams: [],
    fetchingStreams: false,
    streamsError: null,
    fetchingContractProduct: false,
    contractProductError: null,
    fetchingContractSubscription: false,
    contractSubscriptionError: null,
    contractSubscription: null,
    productPermissions: {
        read: false,
        write: false,
        share: false,
        fetchingPermissions: false,
        permissionsError: null,
    },
}

const reducer: (ProductState) => ProductState = handleActions({
    [GET_PRODUCT_BY_ID_REQUEST]: (state: ProductState, action: ProductIdAction) => ({
        ...state,
        id: action.payload.id,
        fetchingProduct: true,
        productError: null,
    }),

    [GET_PRODUCT_BY_ID_SUCCESS]: (state: ProductState) => ({
        ...state,
        fetchingProduct: false,
    }),

    [GET_PRODUCT_BY_ID_FAILURE]: (state: ProductState, action: ProductErrorAction) => ({
        ...state,
        productError: action.payload.error,
        fetchingProduct: false,
    }),

    [GET_STREAMS_BY_PRODUCT_ID_REQUEST]: (state: ProductState) => ({
        ...state,
        streams: [],
        fetchingStreams: true,
        streamsError: null,
    }),

    [GET_STREAMS_BY_PRODUCT_ID_SUCCESS]: (state: ProductState, action: StreamIdsByProductIdAction) => ({
        ...state,
        streams: action.payload.streams,
        fetchingStreams: false,
    }),

    [GET_STREAMS_BY_PRODUCT_ID_FAILURE]: (state: ProductState, action: ProductErrorAction) => ({
        ...state,
        fetchingStreams: false,
        streamsError: action.payload.error,
    }),

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

    [GET_USER_PRODUCT_PERMISSIONS_REQUEST]: (state: ProductState) => ({
        ...state,
        productPermissions: {
            ...state.productPermissions,
            read: false,
            write: false,
            share: false,
            fetchingPermissions: true,
            permissionsError: null,
        },
    }),

    [GET_USER_PRODUCT_PERMISSIONS_SUCCESS]: (state: ProductState, action: UserProductPermissionsIdAction) => ({
        ...state,
        productPermissions: {
            ...state.productPermissions,
            read: action.payload.read,
            write: action.payload.write,
            share: action.payload.share,
            fetchingPermissions: false,
            permissionsError: null,
        },
    }),

    [GET_USER_PRODUCT_PERMISSIONS_FAILURE]: (state: ProductState, action: ProductErrorAction) => ({
        ...state,
        productPermissions: {
            ...state.productPermissions,
            read: false,
            write: false,
            share: false,
            fetchingPermissions: false,
            permissionsError: action.payload.error,
        },
    }),
}, initialState)

export default reducer
