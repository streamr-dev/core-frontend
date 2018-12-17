// @flow

import { handleActions } from 'redux-actions'

import type { MyPurchaseListState } from '../../flowtype/store-state'
import {
    GET_MY_PURCHASES_REQUEST,
    GET_MY_PURCHASES_SUCCESS,
    GET_MY_PURCHASES_FAILURE,
    UPDATE_FILTER,
    UPDATE_RESULTS,
} from './constants'
import type {
    MyPurchasesAction,
    MyPurchasesErrorAction,
    MyPurchasesFilterAction,
} from './types'

export const initialState: MyPurchaseListState = {
    ids: [],
    fetching: false,
    error: null,
    filter: null,
}

const reducer: (MyPurchaseListState) => MyPurchaseListState = handleActions({
    [GET_MY_PURCHASES_REQUEST]: (state: MyPurchaseListState): MyPurchaseListState => ({
        ...state,
        fetching: true,
        error: null,
    }),

    [GET_MY_PURCHASES_SUCCESS]: (state: MyPurchaseListState, action: MyPurchasesAction) => ({
        ...state,
        ids: action.payload.products,
        fetching: false,
    }),

    [GET_MY_PURCHASES_FAILURE]: (state: MyPurchaseListState, action: MyPurchasesErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [UPDATE_FILTER]: (state: MyPurchaseListState, action: MyPurchasesFilterAction) => ({
        ...state,
        filter: action.payload.filter,
    }),

    [UPDATE_RESULTS]: (state: MyPurchaseListState, action: MyPurchasesAction) => ({
        ...state,
        ids: action.payload.products,
    }),

}, initialState)

export default reducer
