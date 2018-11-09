// @flow

import type { HashList, EventLog, EventLogList } from '$shared/flowtype/web3-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { transactionsSchema, productSchema } from '$shared/modules/entities/schema'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectWeb3Accounts } from '$shared/modules/user/selectors'
import * as services from './services'
import { selectEntities } from '$shared/modules/entities/selectors'
import { selectTransactionEvents, selectOffset } from './selectors'
import type { ProductIdList } from '$mp/flowtype/product-types'
import { getProductById } from '$mp/modules/product/services'

export const GET_TRANSACTION_EVENTS_REQUEST = 'GET_TRANSACTION_EVENTS_REQUEST'
export const GET_TRANSACTION_EVENTS_SUCCESS = 'GET_TRANSACTION_EVENTS_SUCCESS'
export const GET_TRANSACTION_EVENTS_FAILURE = 'GET_TRANSACTION_EVENTS_FAILURE'

export const GET_TRANSACTIONS_REQUEST = 'GET_TRANSACTIONS_REQUEST'
export const GET_TRANSACTIONS_SUCCESS = 'GET_TRANSACTIONS_SUCCESS'
export const GET_TRANSACTIONS_FAILURE = 'GET_TRANSACTIONS_FAILURE'

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
        getProductById(id).then(handleEntities(productSchema, dispatch))
    })
}

export const showEvents = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getTransactionsRequest())

    const state = getState()
    const events = selectTransactionEvents(state) || []
    const entities = selectEntities(state)
    const offset = selectOffset(state)

    const eventsToShow = events.splice(offset, 10)
    const eventsToFetch = eventsToShow.filter((event: EventLog) => !(entities.transactions && entities.transactions[event.transactionHash]))
    const productsToFetch = eventsToShow
        .filter((event: EventLog) => !(entities.products && entities.products[event.productId]))
        .reduce((result, event: EventLog) => (result.includes(event.productId) ? result : [...result, event.productId]), [])

    return services.getTransactionsFromEvents(eventsToFetch)
        .then(handleEntities(transactionsSchema, dispatch))
        .then(() => {
            dispatch(getTransactionsSuccess(eventsToShow.map((event) => event.transactionHash)))
            dispatch(fetchProducts(productsToFetch))
        })
        .catch((error) => {
            dispatch(getTransactionsFailure(error))
        })
}

export const getTransactionEvents = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getTransactionEventsRequest())

    const web3Accounts = selectWeb3Accounts(getState())

    return services.getTransactionEvents((web3Accounts || []).map((account) => account.address))
        .then((result) => {
            dispatch(getTransactionEventsSuccess(result))
            dispatch(showEvents())
        })
        .catch((error) => {
            dispatch(getTransactionEventsFailure(error))
        })
}
