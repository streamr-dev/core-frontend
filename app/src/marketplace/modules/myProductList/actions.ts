import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import { ErrorInUi, ReduxActionCreator } from '$shared/types/common-types'
import { productsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import { Filter } from '$userpages/types/common-types'
import { getParamsForFilter } from '$userpages/utils/filters'
import { ProjectIdList } from '../../types/project-types'
import * as api from './services'
import { GET_MY_PRODUCTS_REQUEST, GET_MY_PRODUCTS_SUCCESS, GET_MY_PRODUCTS_FAILURE } from './constants'
import { MyProductsActionCreator, MyProductsErrorActionCreator } from './types'
const getMyProductsRequest: ReduxActionCreator = createAction(GET_MY_PRODUCTS_REQUEST)
const getMyProductsSuccess: MyProductsActionCreator = createAction(GET_MY_PRODUCTS_SUCCESS, (products: ProjectIdList) => ({
    products,
}))
const getMyProductsFailure: MyProductsErrorActionCreator = createAction(GET_MY_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))
export const getMyProducts = (filter?: Filter) => (dispatch: (...args: Array<any>) => any): Promise<ProjectIdList> => {
    dispatch(getMyProductsRequest())
    const params = getParamsForFilter(filter)
    return api.getMyProducts(params).then(
        (data) => {
            const { result, entities } = normalize(data, productsSchema)
            dispatch(updateEntities(entities))
            dispatch(getMyProductsSuccess(result))
            return result
        },
        (error) => dispatch(getMyProductsFailure(error)),
    )
}
