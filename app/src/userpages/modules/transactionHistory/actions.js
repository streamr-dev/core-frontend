// @flow

import type { HashList, EventLog, EventLogList } from '$shared/flowtype/web3-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { handleEntities } from '$shared/utils/entities'
import { transactionsSchema } from '$shared/modules/entities/schema'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectWeb3Accounts } from '$shared/modules/user/selectors'
import * as services from './services'
import { selectEntities } from '$shared/modules/entities/selectors'
import { selectTransactionEvents } from './selectors'

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

export const showEvents = (amount: number = 10) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getTransactionsRequest())

    const state = getState()
    const events = selectTransactionEvents(state) || []
    const entities = selectEntities(state)

    const eventsToShow = events.splice(0, amount)
    const eventsToFetch = eventsToShow.filter((event: EventLog) => !(entities.transactions && entities.transactions[event.transactionHash]))

    return services.getTransactionsFromEvents(eventsToFetch)
        .then(handleEntities(transactionsSchema, dispatch))
        .then(() => {
            dispatch(getTransactionsSuccess(eventsToShow.map((event) => event.transactionHash)))
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
