// @flow

import { handleActions } from 'redux-actions'

import type { PublishState } from '$mp/flowtype/store-state'
import { transactionStates } from '$shared/utils/constants'
import type { PublishAction, HashAction, PublishErrorAction } from '$mp/modules/publish/types'

import {
    UNDEPLOY_PRODUCT_REQUEST,
    RECEIVE_UNDEPLOY_PRODUCT_HASH,
    UNDEPLOY_PRODUCT_SUCCESS,
    UNDEPLOY_PRODUCT_FAILURE,
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
    SET_PRODUCT_UNDEPLOYING_REQUEST,
    SET_PRODUCT_UNDEPLOYING_SUCCESS,
    SET_PRODUCT_UNDEPLOYING_FAILURE,
} from './constants'

export const initialState: PublishState = {
    productId: null,
    publishingContract: false,
    contractTx: null,
    contractError: null,
    publishingFree: false,
    freeProductState: null,
    freeProductError: null,
    setDeploying: false,
    setDeployingError: null,
}

const reducer: (PublishState) => PublishState = handleActions({
    [UNDEPLOY_PRODUCT_REQUEST]: (state: PublishState, action: PublishAction) => ({
        ...state,
        productId: action.payload.id,
        publishingContract: true,
        contractError: null,
        contractTx: null,
    }),

    [RECEIVE_UNDEPLOY_PRODUCT_HASH]: (state: PublishState, action: HashAction) => ({
        ...state,
        contractTx: action.payload.hash,
    }),

    [UNDEPLOY_PRODUCT_SUCCESS]: (state: PublishState) => ({
        ...state,
        publishingContract: false,
    }),

    [UNDEPLOY_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        contractError: action.payload.error,
        publishingContract: false,
    }),

    [POST_UNDEPLOY_FREE_PRODUCT_REQUEST]: (state: PublishState) => ({
        ...state,
        publishingFree: true,
        freeProductError: null,
        freeProductState: transactionStates.STARTED,
    }),

    [POST_UNDEPLOY_FREE_PRODUCT_SUCCESS]: (state: PublishState) => ({
        ...state,
        publishingFree: false,
        freeProductState: transactionStates.CONFIRMED,
    }),

    [POST_UNDEPLOY_FREE_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        publishingFree: false,
        freeProductError: action.payload.error,
        freeProductState: transactionStates.FAILED,
    }),

    [SET_PRODUCT_UNDEPLOYING_REQUEST]: (state: PublishState) => ({
        ...state,
        setDeploying: true,
        setDeployingError: null,
    }),

    [SET_PRODUCT_UNDEPLOYING_SUCCESS]: (state: PublishState) => ({
        ...state,
        setDeploying: false,
    }),

    [SET_PRODUCT_UNDEPLOYING_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        setDeploying: false,
        setDeployingError: action.payload.error,
    }),

}, initialState)

export default reducer
