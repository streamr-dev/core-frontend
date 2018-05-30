// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import { myPurchasesSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import * as api from './services'
import {
    GET_MY_PURCHASES_REQUEST,
    GET_MY_PURCHASES_SUCCESS,
    GET_MY_PURCHASES_FAILURE,
} from './constants'
import type {
    MyPurchasesActionCreator,
    MyPurchasesErrorActionCreator,
} from './types'

export const getMyPurchasesRequest: ReduxActionCreator = createAction(GET_MY_PURCHASES_REQUEST)

export const getMyPurchasesSuccess: MyPurchasesActionCreator = createAction(GET_MY_PURCHASES_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getMyPurchasesFailure: MyPurchasesErrorActionCreator = createAction(GET_MY_PURCHASES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

const handleProductActionLifetime = (dispatch: Function, getMyPurchases) => {
    dispatch(getMyPurchasesRequest())
    return getMyPurchases
        .then((data) => {
            const { result, entities } = normalize(data, myPurchasesSchema)
            dispatch(updateEntities(entities))
            return result
        })
        .then((result) => {
            dispatch(getMyPurchasesSuccess(result))
        }, (error) => {
            dispatch(getMyPurchasesFailure(error))
        })
}

export const getMyPurchases = (dispatch: Function) => handleProductActionLifetime(dispatch, api.getMyPurchases())
