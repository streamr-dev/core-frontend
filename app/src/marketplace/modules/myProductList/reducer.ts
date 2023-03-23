import { handleActions } from 'redux-actions'
import { MyProductListState } from '../../types/store-state'
import { GET_MY_PRODUCTS_REQUEST, GET_MY_PRODUCTS_SUCCESS, GET_MY_PRODUCTS_FAILURE } from './constants'
import { MyProductsAction, MyProductsErrorAction, MyProductIdAction, MyProductsFilterAction } from './types'
export const initialState: MyProductListState = {
    ids: [],
    fetching: false,
    error: null,
}
export type MyProductsActionsPayloads =
    MyProductsAction['payload']
    | MyProductsErrorAction['payload']
    | MyProductIdAction['payload']
    | MyProductsFilterAction['payload']
    | object
const reducer = handleActions<MyProductListState, MyProductsActionsPayloads>(
    {
        [GET_MY_PRODUCTS_REQUEST]: (state: MyProductListState): MyProductListState => ({
            ...state,
            fetching: true,
            error: null,
        }),
        [GET_MY_PRODUCTS_SUCCESS]: (state: MyProductListState, action: MyProductsAction) => ({
            ...state,
            ids: action.payload.products,
            fetching: false,
        }),
        [GET_MY_PRODUCTS_FAILURE]: (state: MyProductListState, action: MyProductsErrorAction) => ({
            ...state,
            fetching: false,
            error: action.payload.error,
        }),
    },
    initialState,
)
export default reducer
