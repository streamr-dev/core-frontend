// @flow

import { handleActions } from 'redux-actions'

import type { PublishState } from '$mp/flowtype/store-state'
import { transactionStates } from '$mp/utils/constants'

import {
    DEPLOY_PRODUCT_REQUEST,
    RECEIVE_DEPLOY_PRODUCT_HASH,
    DEPLOY_PRODUCT_SUCCESS,
    DEPLOY_PRODUCT_FAILURE,
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    SET_PRODUCT_DEPLOYING_REQUEST,
    SET_PRODUCT_DEPLOYING_SUCCESS,
    SET_PRODUCT_DEPLOYING_FAILURE,
} from './constants'
import type { PublishAction, HashAction, PublishErrorAction } from './types'

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
    [DEPLOY_PRODUCT_REQUEST]: (state: PublishState, action: PublishAction) => ({
        ...state,
        productId: action.payload.id,
        publishingContract: true,
        contractError: null,
        contractTx: null,
    }),

    [RECEIVE_DEPLOY_PRODUCT_HASH]: (state: PublishState, action: HashAction) => ({
        ...state,
        contractTx: action.payload.hash,
    }),

    [DEPLOY_PRODUCT_SUCCESS]: (state: PublishState) => ({
        ...state,
        publishingContract: false,
    }),

    [DEPLOY_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        contractError: action.payload.error,
        publishingContract: false,
    }),

    [POST_DEPLOY_FREE_PRODUCT_REQUEST]: (state: PublishState) => ({
        ...state,
        publishingFree: true,
        freeProductError: null,
        freeProductState: transactionStates.STARTED,
    }),

    [POST_DEPLOY_FREE_PRODUCT_SUCCESS]: (state: PublishState) => ({
        ...state,
        publishingFree: false,
        freeProductState: transactionStates.CONFIRMED,
    }),

    [POST_DEPLOY_FREE_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        publishingFree: false,
        freeProductError: action.payload.error,
        freeProductState: transactionStates.FAILED,
    }),

    [SET_PRODUCT_DEPLOYING_REQUEST]: (state: PublishState) => ({
        ...state,
        setDeploying: true,
        setDeployingError: null,
    }),

    [SET_PRODUCT_DEPLOYING_SUCCESS]: (state: PublishState) => ({
        ...state,
        setDeploying: false,
    }),

    [SET_PRODUCT_DEPLOYING_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        setDeploying: false,
        setDeployingError: action.payload.error,
    }),

}, initialState)

export default reducer
