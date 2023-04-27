import { handleActions } from 'redux-actions'
import { MyPurchaseListState } from '../../types/store-state'
import { GET_MY_PURCHASES_REQUEST, GET_MY_PURCHASES_SUCCESS, GET_MY_PURCHASES_FAILURE, UPDATE_FILTER, UPDATE_RESULTS } from './constants'
import { MyPurchasesAction, MyPurchasesErrorAction, MyPurchasesFilterAction, MySubscriptionsAction } from './types'
export const initialState: MyPurchaseListState = {
    products: [],
    subscriptions: [],
    fetching: false,
    error: null,
    filter: null,
}
export type MyPurchaseListActionsPayloads =
    MySubscriptionsAction['payload']
    | MyPurchasesErrorAction['payload']
    | MyPurchasesFilterAction['payload']
    | MyPurchasesAction['payload']
    | object
const reducer = handleActions<MyPurchaseListState, MyPurchaseListActionsPayloads>(
    {
        [GET_MY_PURCHASES_REQUEST]: (state: MyPurchaseListState): MyPurchaseListState => ({
            ...state,
            fetching: true,
            error: null,
        }),
        [GET_MY_PURCHASES_SUCCESS]: (state: MyPurchaseListState, action: MySubscriptionsAction) => ({
            ...state,
            subscriptions: action.payload.subscriptions,
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
            products: action.payload.products,
        }),
    },
    initialState,
)
export default reducer
