// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import orderBy from 'lodash/orderBy'
import get from 'lodash/get'

import type { Product, ProductSubscription } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { subscriptionsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Filter } from '$userpages/flowtype/common-types'
import { getFilters } from '$userpages/utils/constants'
import { isActive } from '$mp/utils/time'

import * as api from './services'
import {
    GET_MY_PURCHASES_REQUEST,
    GET_MY_PURCHASES_SUCCESS,
    GET_MY_PURCHASES_FAILURE,
    UPDATE_FILTER,
    UPDATE_RESULTS,
} from './constants'
import type {
    MyPurchasesActionCreator,
    MyPurchasesErrorActionCreator,
} from './types'
import { selectAllSubscriptions, selectFilter } from './selectors'

const getMyPurchasesRequest: ReduxActionCreator = createAction(GET_MY_PURCHASES_REQUEST)

const getMyPurchasesSuccess: MyPurchasesActionCreator = createAction(GET_MY_PURCHASES_SUCCESS, (products: Array<Product>) => ({
    products,
}))

const getMyPurchasesFailure: MyPurchasesErrorActionCreator = createAction(GET_MY_PURCHASES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

const updateFilterAction = createAction(UPDATE_FILTER, (filter: Filter) => ({
    filter,
}))

const updateResults: MyPurchasesActionCreator = createAction(UPDATE_RESULTS, (products: Array<Product>) => ({
    products,
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

const isSubscriptionActive = (subscription?: ProductSubscription): boolean => isActive((subscription && subscription.endsAt) || '')

const filterPurchases = (data: Array<ProductSubscription>, filter: ?Filter) => {
    if (!filter) {
        return data
    }

    const filtered = data.filter((sub) => {
        let hasTextMatch = true
        let hasKeyValueMatch = true

        // Match textual search
        if (filter && filter.search) {
            const searchTerm = filter.search.trim().toLowerCase()
            hasTextMatch = sub.product.name.toLowerCase().includes(searchTerm)
        }

        // Match key-value filters
        if (filter && filter.key && filter.value) {
            const filterConstants = getFilters()
            const activeFilter = filterConstants.ACTIVE
            const expiredFilter = filterConstants.EXPIRED

            // Active & Expired filters are special
            if (filter.id === activeFilter.filter.id) {
                hasKeyValueMatch = isSubscriptionActive(sub)
            } else if (filter.id === expiredFilter.filter.id) {
                hasKeyValueMatch = !isSubscriptionActive(sub)
            } else {
                // Check match for subscription AND product properties
                hasKeyValueMatch = filter.key && Object.prototype.hasOwnProperty.call(sub, filter.key) &&
                    (sub[filter.key] === filter.value || sub.product[filter.key] === filter.value)
            }
        }

        return hasTextMatch && hasKeyValueMatch
    })

    // Order results if needed (case insensitive)
    if (filter && filter.sortBy && filter.order) {
        return orderBy(filtered, (subscription) => (
            // NOTE: Flow requires another check for `filter` inside this callback. We default
            // the identity of each item to `null` if the filter isn't there.
            filter && filter.sortBy ? get(subscription, `product.${filter.sortBy}`).toLowerCase() : null
        ), filter.order)
    }

    return filtered
}

export const applyFilter = () => (dispatch: Function, getState: () => StoreState) => {
    const filter = selectFilter(getState())
    const subscriptions = selectAllSubscriptions(getState())
    const filtered = filterPurchases(subscriptions, filter)
    const { result } = normalize(filtered, subscriptionsSchema)
    dispatch(updateResults(result))
}

export const updateFilter = (filter: Filter) => (dispatch: Function) => {
    dispatch(updateFilterAction(filter))
    dispatch(applyFilter())
}
