// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { productsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Filter } from '$userpages/flowtype/common-types'
import { getParamsForFilter } from '$userpages/utils/filters'

import * as api from './services'
import {
    GET_MY_PRODUCTS_REQUEST,
    GET_MY_PRODUCTS_SUCCESS,
    GET_MY_PRODUCTS_FAILURE,
    UPDATE_FILTER,
} from './constants'
import type {
    MyProductsActionCreator,
    MyProductsErrorActionCreator,
} from './types'
import { selectFilter } from './selectors'

const getMyProductsRequest: ReduxActionCreator = createAction(GET_MY_PRODUCTS_REQUEST)

const getMyProductsSuccess: MyProductsActionCreator = createAction(GET_MY_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

const getMyProductsFailure: MyProductsErrorActionCreator = createAction(GET_MY_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

const updateFilterAction = createAction(UPDATE_FILTER, (filter: Filter) => ({
    filter,
}))

export const getMyProducts = () => (dispatch: Function, getState: () => StoreState) => {
    dispatch(getMyProductsRequest())

    const filter = selectFilter(getState())
    const params = getParamsForFilter(filter)

    return api.getMyProducts(params)
        .then((data) => {
            const { result, entities } = normalize(data, productsSchema)
            dispatch(updateEntities(entities))
            dispatch(getMyProductsSuccess(result))
        }, (error) => dispatch(getMyProductsFailure(error)))
}

export const updateFilter = (filter: Filter) => (dispatch: Function) => (
    dispatch(updateFilterAction(filter))
)
