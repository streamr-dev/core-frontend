import { handleActions } from 'redux-actions'
import { ProductListState } from '../../types/store-state'
import { productListPageSize } from '../../utils/constants'
import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_SUCCESS,
    GET_PRODUCTS_FAILURE,
    UPDATE_FILTER,
    CLEAR_FILTERS,
    CLEAR_PRODUCT_LIST,
    UPDATE_PROJECTS_AUTHOR_FILTER
} from './constants'
import { ProductsAction, ProductsErrorAction, FilterAction, ProjectsAuthorFilterAction } from './types'
export const initialState: ProductListState = {
    ids: [],
    filter: {
        search: '',
        categories: undefined,
        sortBy: undefined,
        maxPrice: undefined,
        type: undefined,
    },
    fetching: false,
    error: undefined,
    pageSize: productListPageSize,
    offset: 0,
    hasMoreSearchResults: undefined,
    projectAuthor: 'all'
}
export type ProductListActionPayloads = ProductsAction['payload'] | ProductsErrorAction['payload'] | FilterAction['payload'] | object
const reducer = handleActions<ProductListState, ProductListActionPayloads>(
    {
        [GET_PRODUCTS_REQUEST]: (state: ProductListState): ProductListState => ({
            ...state,
            fetching: true,
            error: undefined,
        }),
        [GET_PRODUCTS_SUCCESS]: (state: ProductListState, action: ProductsAction) => ({
            ...state,
            ids: state.ids.concat(action.payload.products),
            fetching: false,
            offset: state.offset + action.payload.products.length,
            hasMoreSearchResults: action.payload.hasMore,
        }),
        [GET_PRODUCTS_FAILURE]: (state: ProductListState, action: ProductsErrorAction) => ({
            ...state,
            fetching: false,
            error: action.payload.error,
        }),
        [UPDATE_FILTER]: (state: ProductListState, action: FilterAction): ProductListState => ({
            ...state,
            filter: { ...state.filter, ...action.payload.filter },
        }),
        [CLEAR_FILTERS]: (state: ProductListState) => ({
            ...state,
            filter: initialState.filter,
        }),
        [CLEAR_PRODUCT_LIST]: (state: ProductListState) => ({
            ...state,
            error: undefined,
            ids: [],
            offset: 0,
            hasMoreSearchResults: undefined,
        }),
        [UPDATE_PROJECTS_AUTHOR_FILTER]: (state: ProductListState, action: ProjectsAuthorFilterAction) => ({
            ...state,
            projectAuthor: action.payload.onlyMyProjects ? 'currentUser' : 'all'
        })
    },
    initialState,
)
export default reducer
