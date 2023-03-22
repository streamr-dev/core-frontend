import { Action, AnyAction } from 'redux'
import { HashList, EventLog, EventLogList, TransactionEntityList, TransactionEntity } from '$shared/types/web3-types'
import { ErrorInUi } from '$shared/types/common-types'
import { handleEntities } from '$shared/utils/entities'
import { transactionsSchema, contractProductSchema } from '$shared/modules/entities/schema'
import { StoreState } from '$shared/types/store-state'
import { selectEntities } from '$shared/modules/entities/selectors'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'
import { ProjectIdList } from '$mp/types/project-types'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { selectMyProductList } from '$mp/modules/myProductList/selectors'
import { isEthereumAddress } from '$mp/utils/validate'
import { getValidId } from '$mp/utils/product'
import {useAuthController} from "$auth/hooks/useAuthController"
import { selectTransactionEvents, selectOffset } from './selectors'
import * as services from './services'
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

const getTransactionsFailure = (error: ErrorInUi): AnyAction => ({
    type: GET_TRANSACTIONS_FAILURE,
    error,
})

export const fetchProducts =
    (ids: ProjectIdList, chainId: number) =>
        (dispatch: (...args: Array<any>) => void): void => {
            (ids || []).forEach((id) => {
                try {
                    getProductFromContract(id, true, chainId)
                        .then(handleEntities(contractProductSchema, dispatch))
                        .catch((e) => {
                            console.warn(e)
                        })
                } catch (e) {
                    console.warn(e)
                }
            })
        }
export const clearTransactionList = (): Action => ({
    type: CLEAR_TRANSACTION_LIST,
})

export const showEvents =
    () =>
        (dispatch: (...args: Array<any>) => void, getState: () => StoreState): Promise<void> => {
            dispatch(getTransactionsRequest())
            const state = getState()
            const events = selectTransactionEvents(state) || []
            const entities = selectEntities(state)
            const offset = selectOffset(state)
            const chainId = selectEthereumNetworkId(state)
            const eventsToShow = events.splice(offset, 10)
            const eventsToFetch = eventsToShow.filter((event: EventLog) => !(entities.transactions && entities.transactions[event.id]))
            return services
                .getTransactionsFromEvents(eventsToFetch)
                .then((data: TransactionEntityList) => {
                    const productsToFetch: ProjectIdList = data
                        .filter(
                            (transaction: TransactionEntity) =>
                                transaction.productId &&
                            transaction.productId !== '0x0' &&
                            !(entities.contractProducts && entities.contractProducts[transaction.productId]),
                        )
                        .reduce(
                            (result, transaction: TransactionEntity) =>
                                result.includes(transaction.productId) ? result : [...result, transaction.productId || ''],
                            [],
                        )
                    dispatch(fetchProducts(productsToFetch, chainId))
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
export const getTransactionEvents =
    () =>
        (dispatch: (...args: Array<any>) => void, getState: () => StoreState): Promise<void> => {
            const state = getState()
            const {currentAuthSession} = useAuthController()
            const address = currentAuthSession.address
            if (!address || !isEthereumAddress(address)) {
                return dispatch(getTransactionsSuccess([]))

            }
            const products = selectMyProductList(state)
            const ownedProductIds: ProjectIdList = (products || [])
                .filter(({ ownerAddress }) => (ownerAddress || '').toLowerCase() === address)
                .map(({ id }) => getValidId(id || ''))
            dispatch(getTransactionEventsRequest())
            return services
                .getTransactionEvents([address], ownedProductIds)
                .then((result) => {
                    dispatch(getTransactionEventsSuccess(result))
                    dispatch(showEvents())
                })
                .catch((error) => {
                    dispatch(getTransactionEventsFailure(error))
                })
        }
