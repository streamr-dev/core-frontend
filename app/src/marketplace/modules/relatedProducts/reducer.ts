import { handleActions } from 'redux-actions'
import { RelatedProductListState } from '../../types/store-state'
import { GET_RELATED_PRODUCTS_REQUEST, GET_RELATED_PRODUCTS_SUCCESS, GET_RELATED_PRODUCTS_FAILURE } from './constants'
import { RelatedProductsAction, RelatedProductsErrorAction } from './types'
export const initialState: RelatedProductListState = {
    ids: [],
    fetching: false,
    error: null,
}
export type RelatedProductsActionPayloads = RelatedProductsAction['payload'] | RelatedProductsErrorAction['payload'] | object
export const reducer = handleActions<RelatedProductListState, RelatedProductsActionPayloads>(
    {
        [GET_RELATED_PRODUCTS_REQUEST]: (state: RelatedProductListState): RelatedProductListState => ({
            ...state,
            fetching: true,
            error: null,
        }),
        [GET_RELATED_PRODUCTS_SUCCESS]: (state: RelatedProductListState, action: RelatedProductsAction) => ({
            ...state,
            ids: action.payload.products,
            fetching: false,
        }),
        [GET_RELATED_PRODUCTS_FAILURE]: (state: RelatedProductListState, action: RelatedProductsErrorAction) => ({
            ...state,
            fetching: false,
            error: action.payload.error,
        }),
    },
    initialState,
)
export default reducer
