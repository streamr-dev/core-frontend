// @flow
import { createAction } from 'redux-actions'
import * as api from './services'

import {
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAILURE,
} from './constants'
import type {
    CategoriesActionCreator,
    CategoriesErrorActionCreator,
} from './types'
import type { Category } from '../../flowtype/category-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'

export const getCategoriesRequest: ReduxActionCreator = createAction(GET_CATEGORIES_REQUEST)

export const getCategoriesSuccess: CategoriesActionCreator = createAction(GET_CATEGORIES_SUCCESS, (categories: Array<Category>) => ({
    categories,
}))

export const getCategoriesFailure: CategoriesErrorActionCreator = createAction(GET_CATEGORIES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getCategories = () => (dispatch: Function) => {
    dispatch(getCategoriesRequest())
    return api.getCategories()
        .then((data) => dispatch(getCategoriesSuccess(data)))
        .catch((error) => dispatch(getCategoriesFailure(error)))
}
