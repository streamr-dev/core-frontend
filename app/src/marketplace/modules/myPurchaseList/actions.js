// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { subscriptionsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
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

const getMyPurchasesRequest: ReduxActionCreator = createAction(GET_MY_PURCHASES_REQUEST)

const getMyPurchasesSuccess: MyPurchasesActionCreator = createAction(GET_MY_PURCHASES_SUCCESS, (products: Array<Product>) => ({
    products,
}))

const getMyPurchasesFailure: MyPurchasesErrorActionCreator = createAction(GET_MY_PURCHASES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getMyPurchases = () => (dispatch: Function) => {
    dispatch(getMyPurchasesRequest())
    return api.getMyPurchases()
        .then((data) => {
            const { result, entities } = normalize(data, subscriptionsSchema)

            // Need to clear the streams field since API will always return an empty list
            // that might unset values in the current product being viewed
            const filteredEntities = {
                ...entities,
                products: Object.keys(entities.products).reduce((values, id) => {
                    const { streams, ...withoutStreams } = entities.products[id]

                    return {
                        ...values,
                        [id]: {
                            ...withoutStreams,
                        },
                    }
                }, {}),
            }
            dispatch(updateEntities(filteredEntities))

            return result
        })
        .then((result) => {
            dispatch(getMyPurchasesSuccess(result))
        }, (error) => {
            dispatch(getMyPurchasesFailure(error))
        })
}
