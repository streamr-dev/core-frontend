// @flow

import type { Hash, HashList } from '$shared/flowtype/web3-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { transactionsSchema } from '$shared/modules/entities/schema'

import * as services from './services'

export const GET_TRANSACTIONS_REQUEST = 'GET_TRANSACTIONS_REQUEST'
export const GET_TRANSACTIONS_SUCCESS = 'GET_TRANSACTIONS_SUCCESS'
export const GET_TRANSACTIONS_FAILURE = 'GET_TRANSACTIONS_FAILURE'

const getTransactionRequest = () => ({
    type: GET_TRANSACTIONS_REQUEST,
})

const getTransactionsSuccess = (transactions: HashList) => ({
    type: GET_TRANSACTIONS_SUCCESS,
    transactions,
})

const getTransactionsFailure = (error: ErrorInUi) => ({
    type: GET_TRANSACTIONS_FAILURE,
    error,
})

export const getTransactions = (address: Hash | HashList) => (dispatch: Function) => {
    dispatch(getTransactionRequest())

    return services.getTransactions(address)
        .then(handleEntities(transactionsSchema, dispatch))
        .then((result) => {
            dispatch(getTransactionsSuccess(result))
        })
        .catch((error) => {
            dispatch(getTransactionsFailure(error))
        })
}
