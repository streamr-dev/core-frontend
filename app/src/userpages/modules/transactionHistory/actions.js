// @flow

import type { HashList, EventLog, EventLogList, TransactionEntityList, TransactionEntity } from '$shared/flowtype/web3-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { transactionsSchema, contractProductSchema } from '$shared/modules/entities/schema'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import * as services from './services'
import { selectEntities } from '$shared/modules/entities/selectors'
import { selectTransactionEvents, selectOffset } from './selectors'
import type { ProductIdList } from '$mp/flowtype/product-types'
import { getProductFromContract } from '$mp/modules/contractProduct/services'

export const GET_TRANSACTION_EVENTS_REQUEST = 'GET_TRANSACTION_EVENTS_REQUEST'
export const GET_TRANSACTION_EVENTS_SUCCESS = 'GET_TRANSACTION_EVENTS_SUCCESS'
export const GET_TRANSACTION_EVENTS_FAILURE = 'GET_TRANSACTION_EVENTS_FAILURE'

export const GET_TRANSACTIONS_REQUEST = 'GET_TRANSACTIONS_REQUEST'
export const GET_TRANSACTIONS_SUCCESS = 'GET_TRANSACTIONS_SUCCESS'
export const GET_TRANSACTIONS_FAILURE = 'GET_TRANSACTIONS_FAILURE'

export const CLEAR_TRANSACTION_LIST = 'CLEAR_TRANSACTION_LIST'

const getTransactionEventsRequest = () => ({
    type: GET_TRANSACTION_EVENTS_REQUEST,
})

const getTransactionEventsSuccess = (events: EventLogList) => ({
    type: GET_TRANSACTION_EVENTS_SUCCESS,
    events,
})

const getTransactionEventsFailure = (error: ErrorInUi) => ({
    type: GET_TRANSACTION_EVENTS_FAILURE,
    error,
})

const getTransactionsRequest = () => ({
    type: GET_TRANSACTIONS_REQUEST,
})

const getTransactionsSuccess = (ids: HashList) => ({
    type: GET_TRANSACTIONS_SUCCESS,
    ids,
})

const getTransactionsFailure = (error: ErrorInUi) => ({
    type: GET_TRANSACTIONS_FAILURE,
    error,
})

export const fetchProducts = (ids: ProductIdList) => (dispatch: Function) => {
    (ids || []).forEach((id) => {
        try {
            getProductFromContract(id, true)
                .then(handleEntities(contractProductSchema, dispatch))
                .catch((e) => {
                    console.warn(e)
                })
        } catch (e) {
            console.warn(e)
        }
    })
}

export const clearTransactionList = () => ({
    type: CLEAR_TRANSACTION_LIST,
})

export const noTransactionResults = () => (dispatch: Function) => {
    dispatch(getTransactionsSuccess([]))
}

export const showEvents = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getTransactionsRequest())

    const state = getState()
    const events = selectTransactionEvents(state) || []
    const entities = selectEntities(state)
    const offset = selectOffset(state)

    const eventsToShow = events.splice(offset, 10)
    const eventsToFetch = eventsToShow.filter((event: EventLog) => !(entities.transactions && entities.transactions[event.id]))

    return services.getTransactionsFromEvents(eventsToFetch)
        .then((data: TransactionEntityList) => {
            const productsToFetch: ProductIdList = data
                .filter((transaction: TransactionEntity) => transaction.productId && transaction.productId !== '0x0' && !(
                    entities.contractProducts &&
                    entities.contractProducts[transaction.productId]
                ))
                .reduce((result, transaction: TransactionEntity) => (
                    result.includes(transaction.productId) ? result : [...result, (transaction.productId || '')]
                ), [])

            dispatch(fetchProducts(productsToFetch))
            return data
        })
        .then(handleEntities(transactionsSchema, dispatch))
        .then(() => {
            dispatch(getTransactionsSuccess(eventsToShow.map((event) => event.id)))
        })
        .catch((error) => {
            dispatch(getTransactionsFailure(error))
        })
}

export const getTransactionEvents = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getTransactionEventsRequest())

    const web3Accounts = selectEthereumIdentities(getState())

    return services.getTransactionEvents((web3Accounts || []).map((account) => (account.json || {}).address || ''))
        .then((result) => {
            dispatch(getTransactionEventsSuccess(result))
            dispatch(showEvents())
        })
        .catch((error) => {
            dispatch(getTransactionEventsFailure(error))
        })
}
