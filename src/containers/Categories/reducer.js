// @flow
import { handleActions } from 'redux-actions'

import {
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILURE,
} from './constants'
import type {CategoryState} from '../../flowtype/store-state'
import type {
    CategoriesAction,
    CategoriesErrorAction,
} from './types'

const initialState: CategoryState = {
    byId: {},
    fetching: false,
    error: null
}

const reducer = handleActions({
    [GET_CATEGORIES_REQUEST]: (state: CategoryState): CategoryState => ({
        ...state,
        fetching: true
    }),

    [GET_CATEGORIES_SUCCESS]: (state: CategoryState, action: CategoriesAction) => ({
        ...state,
        byId: action.payload.categories.reduce((acc, curr) => ({
            ...acc,
            [curr.id]: curr
        }), {}),
        fetching: false
    }),

    [GET_CATEGORIES_FAILURE]: (state: CategoryState, action: CategoriesErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),
}, initialState)

export default reducer
