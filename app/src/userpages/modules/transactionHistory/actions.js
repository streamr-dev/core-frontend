// @flow

import type { HashList } from '$shared/flowtype/web3-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

export const GET_TRANSACTIONS_REQUEST = 'GET_TRANSACTIONS_REQUEST'
export const GET_TRANSACTIONS_SUCCESS = 'GET_TRANSACTIONS_SUCCESS'
export const GET_TRANSACTIONS_FAILURE = 'GET_TRANSACTIONS_FAILURE'

export const getTransactionRequest = () => ({
    type: GET_TRANSACTIONS_REQUEST,
})

export const getTransactionsSuccess = (transactions: HashList) => ({
    type: GET_TRANSACTIONS_SUCCESS,
    transactions,
})

export const getTransactionsFailure = (error: ErrorInUi) => ({
    type: GET_TRANSACTIONS_FAILURE,
    error,
})
