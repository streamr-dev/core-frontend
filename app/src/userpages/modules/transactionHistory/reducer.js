// @flow

import type { TransactionHistoryState } from '$userpages/flowtype/states/transaction-history-state'

import {
    GET_TRANSACTION_EVENTS_REQUEST,
    GET_TRANSACTION_EVENTS_SUCCESS,
    GET_TRANSACTION_EVENTS_FAILURE,
    GET_TRANSACTIONS_REQUEST,
    GET_TRANSACTIONS_SUCCESS,
    GET_TRANSACTIONS_FAILURE,
    CLEAR_TRANSACTION_LIST,
} from './actions'

const initialState: TransactionHistoryState = {
    events: [],
    ids: [],
    fetching: true,
    error: null,
    offset: 0,
}

const transactionHistory = (state: TransactionHistoryState = initialState, action: any): TransactionHistoryState => {
    switch (action.type) {
        case CLEAR_TRANSACTION_LIST:
        case GET_TRANSACTION_EVENTS_REQUEST:
            return {
                ...state,
                ids: [],
                events: [],
                offset: 0,
                fetching: true,
            }

        case GET_TRANSACTION_EVENTS_SUCCESS:
            return {
                ...state,
                events: action.events,
                fetching: action.events.length > 0,
            }

        case GET_TRANSACTION_EVENTS_FAILURE:
            return {
                ...state,
                error: action.error,
                fetching: false,
            }

        case GET_TRANSACTIONS_REQUEST:
            return {
                ...state,
                fetching: true,
            }

        case GET_TRANSACTIONS_SUCCESS: {
            const ids = new Set([...state.ids, ...action.ids])

            return {
                ...state,
                ids: [...ids],
                offset: Math.max((state.offset + action.ids.length) - 1, 0),
                fetching: false,
            }
        }

        case GET_TRANSACTIONS_FAILURE:
            return {
                ...state,
                error: action.error,
                fetching: false,
            }

        default:
            return state
    }
}

export default transactionHistory
