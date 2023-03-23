import { handleActions } from 'redux-actions'
import { CategoryState } from '../../types/store-state'
import { GET_CATEGORIES_REQUEST, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAILURE } from './constants'
import { CategoriesAction, CategoriesErrorAction } from './types'
export const initialState: CategoryState = {
    ids: [],
    fetching: false,
    error: null,
}
export type CategoriesActionsPayloads = CategoriesAction['payload'] | CategoriesErrorAction['payload'] | object
const reducer = handleActions<CategoryState, CategoriesActionsPayloads>(
    {
        [GET_CATEGORIES_REQUEST]: (state: CategoryState): CategoryState => ({
            ...state,
            fetching: true,
        }),
        [GET_CATEGORIES_SUCCESS]: (state: CategoryState, action: CategoriesAction) => ({
            ids: action.payload.categories,
            fetching: false,
            error: null,
        }),
        [GET_CATEGORIES_FAILURE]: (state: CategoryState, action: CategoriesErrorAction) => ({
            ...state,
            fetching: false,
            error: action.payload.error,
        }),
    },
    initialState,
)
export default reducer
