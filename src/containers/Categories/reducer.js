// @flow
import { handleActions } from 'redux-actions'

import {
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILURE,
    GET_PRODUCTS_BY_CATEGORY_REQUEST,
    GET_PRODUCTS_BY_CATEGORY_SUCCESS,
    GET_PRODUCTS_BY_CATEGORY_FAILURE,
} from './constants'
import type {CategoryState} from '../../flowtype/store-state'
import type {
    CategoryIdAction,
    CategoriesAction,
    CategoriesErrorAction,
    CategoryErrorAction,
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

    [GET_PRODUCTS_BY_CATEGORY_REQUEST]: (state: CategoryState, action: CategoryIdAction) => ({
        ...state,
        byId: {
            ...state.byId,
            [action.payload.id]: {
                ...(state.byId[action.payload.id] || {}),
                fetchingProducts: true
            }
        }
    }),

    [GET_CATEGORIES_SUCCESS]: (state: CategoryState, action: CategoriesAction) => ({
        ...state,
        byId: action.payload.categories.reduce((acc, curr) => ({
            ...acc,
            [curr.id]: curr
        }), {}),
        fetching: false
    }),

    [GET_PRODUCTS_BY_CATEGORY_SUCCESS]: (state: CategoryState) => ({
        ...state,
    }),

    [GET_CATEGORIES_FAILURE]: (state: CategoryState, action: CategoriesErrorAction) => ({
        ...state,
        fetching: false,
        error: action.payload.error,
    }),

    [GET_PRODUCTS_BY_CATEGORY_FAILURE]: (state: CategoryState, action: CategoryErrorAction) => {
        const newById = {
            ...state.byId
        }
        const category = newById[action.payload.id]
        if (category.fetching && Object.keys(category).length === 1) {
            delete newById[action.payload.id]
        } else {
            category.fetching = false
        }
        return {
            ...state,
            byId: newById,
            error: action.payload.error
        }
    },

}, initialState)

export default reducer
