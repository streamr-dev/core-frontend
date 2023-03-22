import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import { categoriesSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import { ErrorInUi, ReduxActionCreator } from '$shared/types/common-types'
import { EntitiesValue } from '$shared/modules/entities/types'
import { CategoryIdList } from '../../types/category-types'
import * as api from './services'
import { GET_CATEGORIES_REQUEST, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAILURE } from './constants'
import { CategoriesActionCreator, CategoriesErrorActionCreator } from './types'
const getCategoriesRequest: ReduxActionCreator = createAction(GET_CATEGORIES_REQUEST)
const getCategoriesSuccess: CategoriesActionCreator = createAction(GET_CATEGORIES_SUCCESS, (categories: CategoryIdList) => ({
    categories,
}))
const getCategoriesFailure: CategoriesErrorActionCreator = createAction(GET_CATEGORIES_FAILURE, (error: ErrorInUi) => ({
    error,
}))
export const getCategories = (includeEmpty: boolean) => (dispatch: (...args: Array<any>) => any): Promise<void> => {
    dispatch(getCategoriesRequest())
    return api
        .getCategories(includeEmpty)
        .then((data) => {
            const { result, entities }: {result: CategoryIdList, entities: EntitiesValue} = normalize(data, categoriesSchema)
            dispatch(updateEntities(entities))
            return result
        })
        .then(
            (result) => {
                dispatch(getCategoriesSuccess(result))
            },
            (error) => {
                dispatch(getCategoriesFailure(error))
            },
        )
}
