// @flow

import { handleActions } from 'redux-actions'

import type { PublishState } from '../../flowtype/store-state'
import { transactionStates } from '../../utils/constants'

import {
    DEPLOY_PRODUCT_REQUEST,
    RECEIVE_DEPLOY_PRODUCT_HASH,
    DEPLOY_PRODUCT_SUCCESS,
    DEPLOY_PRODUCT_FAILURE,
    POST_DEPLOY_FREE_PRODUCT_REQUEST,
    POST_DEPLOY_FREE_PRODUCT_SUCCESS,
    POST_DEPLOY_FREE_PRODUCT_FAILURE,
    POST_UNDEPLOY_FREE_PRODUCT_REQUEST,
    POST_UNDEPLOY_FREE_PRODUCT_SUCCESS,
    POST_UNDEPLOY_FREE_PRODUCT_FAILURE,
    SET_PRODUCT_DEPLOYING_REQUEST,
    SET_PRODUCT_DEPLOYING_SUCCESS,
    SET_PRODUCT_DEPLOYING_FAILURE,
} from './constants'
import type { PublishAction, HashAction, ReceiptAction, PublishErrorAction } from './types'

export const initialState: PublishState = {
    hash: null,
    productId: null,
    receipt: null,
    processing: false,
    error: null,
    transactionState: null,
    isPublish: false,
}

const reducer: (PublishState) => PublishState = handleActions({
    [DEPLOY_PRODUCT_REQUEST]: (state: PublishState, action: PublishAction) => ({
        ...state,
        hash: null,
        productId: action.payload.id,
        receipt: null,
        processing: true,
        error: null,
        transactionState: transactionStates.STARTED,
        isPublish: action.payload.isPublish,
    }),

    [RECEIVE_DEPLOY_PRODUCT_HASH]: (state: PublishState, action: HashAction) => ({
        ...state,
        hash: action.payload.hash,
        transactionState: transactionStates.PENDING,
    }),

    [DEPLOY_PRODUCT_SUCCESS]: (state: PublishState, action: ReceiptAction) => ({
        ...state,
        receipt: action.payload.receipt,
        processing: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [DEPLOY_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        error: action.payload.error,
        processing: false,
        transactionState: transactionStates.FAILED,
    }),

    [POST_DEPLOY_FREE_PRODUCT_REQUEST]: (state: PublishState) => ({
        ...state,
        processing: true,
        error: null,
        transactionState: transactionStates.STARTED,
    }),

    [POST_DEPLOY_FREE_PRODUCT_SUCCESS]: (state: PublishState) => ({
        ...state,
        processing: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [POST_DEPLOY_FREE_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        processing: false,
        error: action.payload.error,
        transactionState: transactionStates.FAILED,
    }),

    [POST_UNDEPLOY_FREE_PRODUCT_REQUEST]: (state: PublishState) => ({
        ...state,
        processing: true,
        error: null,
        transactionState: transactionStates.STARTED,
    }),

    [POST_UNDEPLOY_FREE_PRODUCT_SUCCESS]: (state: PublishState) => ({
        ...state,
        processing: false,
        transactionState: transactionStates.CONFIRMED,
    }),

    [POST_UNDEPLOY_FREE_PRODUCT_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        processing: false,
        error: action.payload.error,
        transactionState: transactionStates.FAILED,
    }),

    [SET_PRODUCT_DEPLOYING_REQUEST]: (state: PublishState) => ({
        ...state,
        processing: true,
        error: null,
    }),

    [SET_PRODUCT_DEPLOYING_SUCCESS]: (state: PublishState) => ({
        ...state,
        processing: false,
    }),

    [SET_PRODUCT_DEPLOYING_FAILURE]: (state: PublishState, action: PublishErrorAction) => ({
        ...state,
        processing: false,
        error: action.payload.error,
    }),

}, initialState)

export default reducer
