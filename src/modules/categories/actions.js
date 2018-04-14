// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import { categoriesSchema } from '../../modules/entities/schema'
import { updateEntities } from '../../modules/entities/actions'
import type { CategoryList } from '../../flowtype/category-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'

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

export const getCategoriesRequest: ReduxActionCreator = createAction(GET_CATEGORIES_REQUEST)

export const getCategoriesSuccess: CategoriesActionCreator = createAction(GET_CATEGORIES_SUCCESS, (categories: CategoryList) => ({
    categories,
}))

export const getCategoriesFailure: CategoriesErrorActionCreator = createAction(GET_CATEGORIES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getCategories = () => (dispatch: Function) => {
    dispatch(getCategoriesRequest())
    return api.getCategories()
        .then((data) => {
            const { result, entities } = normalize(data, categoriesSchema)

            dispatch(updateEntities(entities))
            dispatch(getCategoriesSuccess(result))
        })
        .catch((error) => dispatch(getCategoriesFailure(error)))
}
