// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import { categoriesSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { CategoryList } from '../../flowtype/category-types'

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

const getCategoriesRequest: ReduxActionCreator = createAction(GET_CATEGORIES_REQUEST)

const getCategoriesSuccess: CategoriesActionCreator = createAction(GET_CATEGORIES_SUCCESS, (categories: CategoryList) => ({
    categories,
}))

const getCategoriesFailure: CategoriesErrorActionCreator = createAction(GET_CATEGORIES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getCategories = (includeEmpty: boolean) => (dispatch: Function) => {
    dispatch(getCategoriesRequest())
    return api.getCategories(includeEmpty)
        .then((data) => {
            const { result, entities } = normalize(data, categoriesSchema)
            dispatch(updateEntities(entities))
            return result
        })
        .then((result) => {
            dispatch(getCategoriesSuccess(result))
        }, (error) => {
            dispatch(getCategoriesFailure(error))
        })
}
