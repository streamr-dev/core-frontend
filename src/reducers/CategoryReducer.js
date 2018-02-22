// @flow

import {
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILURE,
    GET_PRODUCTS_BY_CATEGORY_REQUEST,
    GET_PRODUCTS_BY_CATEGORY_SUCCESS,
    GET_PRODUCTS_BY_CATEGORY_FAILURE
} from '../actions/CategoryActions'

import type {CategoryState} from '../flowtype/store-state'

const defaultState: CategoryState = {
    byId: {},
    fetching: false,
    error: null
}

export default (state: CategoryState = defaultState, action: any): CategoryState => {
    switch (action.type) {
        case GET_CATEGORIES_REQUEST:
            return {
                ...state,
                fetching: true
            }

        case GET_PRODUCTS_BY_CATEGORY_REQUEST:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.id]: {
                        ...(state.byId[action.id] || {}),
                        fetchingProducts: true
                    }
                }
            }

        case GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                byId: action.categories.reduce((acc, curr) => ({
                    ...acc,
                    [curr.id]: curr
                }), {}),
                fetching: false
            }

        case GET_PRODUCTS_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.category.id]: action.category
                }
            }

        case GET_CATEGORIES_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error
            }

        case GET_PRODUCTS_BY_CATEGORY_FAILURE: {
            const newById = {
                ...state.byId
            }
            const category = newById[action.id]
            if (category.fetching && Object.keys(category).length === 1) {
                delete newById[action.id]
            } else {
                category.fetching = false
            }
            return {
                ...state,
                byId: newById,
                error: action.error
            }
        }

        default:
            return state
    }
}