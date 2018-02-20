// @flow

import {without} from 'lodash'

import {
    CLICK_TRANSACTION_CREATE_REQUEST,
    CLICK_TRANSACTION_CREATE_SUCCESS,
    CLICK_TRANSACTION_CREATE_FAILURE,
    CLICK_TRANSACTION_EXECUTE_SUCCESS,
    CLICK_TRANSACTION_EXECUTE_FAILURE,
    RESET_CLICK_COUNT_TRANSACTION_CREATE_REQUEST,
    RESET_CLICK_COUNT_TRANSACTION_CREATE_SUCCESS,
    RESET_CLICK_COUNT_TRANSACTION_CREATE_FAILURE,
    RESET_CLICK_COUNT_TRANSACTION_EXECUTE_SUCCESS,
    RESET_CLICK_COUNT_TRANSACTION_EXECUTE_FAILURE,
    GET_CLICK_COUNT_REQUEST,
    GET_CLICK_COUNT_SUCCESS,
    GET_CLICK_COUNT_FAILURE,
    TEST_WEB3_BROWSER,
    TEST_NETWORK
} from '../actions/Web3TesterActions'

import type {Web3State} from '../flowtype/states/web3-state'

const defaultState: Web3State = {
    web3Enabled: null,
    network: null,
    fetching: false,
    creatingTransaction: false,
    executingTransactions: [],
    clickCount: null
}

export default (state: Web3State = defaultState, action: any): Web3State => {
    switch (action.type) {
        case GET_CLICK_COUNT_REQUEST:
            return {
                ...state,
                fetching: true
            }

        case CLICK_TRANSACTION_CREATE_REQUEST:
        case RESET_CLICK_COUNT_TRANSACTION_CREATE_REQUEST:
            return {
                ...state,
                creatingTransaction: true
            }

        case GET_CLICK_COUNT_SUCCESS:
            return {
                ...state,
                fetching: false,
                clickCount: action.count
            }

        case CLICK_TRANSACTION_CREATE_SUCCESS:
        case RESET_CLICK_COUNT_TRANSACTION_CREATE_SUCCESS:
            return {
                ...state,
                creatingTransaction: false,
                executingTransactions: [...state.executingTransactions, action.address]
            }

        case RESET_CLICK_COUNT_TRANSACTION_EXECUTE_SUCCESS:
            return {
                ...state,
                executingTransactions: without(state.executingTransactions, action.address),
                clickCount: 0
            }

        case CLICK_TRANSACTION_EXECUTE_SUCCESS:
            return {
                ...state,
                executingTransactions: without(state.executingTransactions, action.address),
                clickCount: action.count
            }

        case GET_CLICK_COUNT_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error
            }

        case CLICK_TRANSACTION_CREATE_FAILURE:
        case RESET_CLICK_COUNT_TRANSACTION_CREATE_FAILURE:
            return {
                ...state,
                creatingTransaction: false
            }

        case CLICK_TRANSACTION_EXECUTE_FAILURE:
        case RESET_CLICK_COUNT_TRANSACTION_EXECUTE_FAILURE:
            return {
                ...state,
                executingTransactions: without(state.executingTransactions, action.address),
                error: action.error
            }

        case TEST_WEB3_BROWSER:
            return {
                ...state,
                web3Enabled: action.web3Enabled
            }

        case TEST_NETWORK:
            return {
                ...state,
                network: action.network
            }

        default:
            return state
    }
}
