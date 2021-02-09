// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import orderBy from 'lodash/orderBy'
import get from 'lodash/get'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import { subscriptionsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Filter } from '$userpages/flowtype/common-types'
import { getFilters } from '$userpages/utils/constants'
import { isActive } from '$mp/utils/time'
import type {
    ProductSubscription,
    ProductIdList,
    ProductSubscriptionIdList,
    ProductSubscriptionList,
} from '../../flowtype/product-types'

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
    MySubscriptionsActionCreator,
} from './types'
import { selectSubscriptions, selectFilter } from './selectors'

const getMyPurchasesRequest: ReduxActionCreator = createAction(GET_MY_PURCHASES_REQUEST)

const getMyPurchasesSuccess: MySubscriptionsActionCreator = createAction(GET_MY_PURCHASES_SUCCESS, (subscriptions: ProductSubscriptionIdList) => ({
    subscriptions,
}))

const getMyPurchasesFailure: MyPurchasesErrorActionCreator = createAction(GET_MY_PURCHASES_FAILURE, (error: ErrorInUi) => ({
    error,
}))

const updateFilterAction = createAction(UPDATE_FILTER, (filter: Filter) => ({
    filter,
}))

const updateResults: MyPurchasesActionCreator = createAction(UPDATE_RESULTS, (products: ProductIdList) => ({
    products,
}))

export const getMyPurchases = () => (dispatch: Function) => {
    dispatch(getMyPurchasesRequest())
    return api.getMyPurchases()
        .then((data) => {
            // Reduce subscriptions to remove duplicate products
            const uniqueSubscriptions = data.reduce((result, subscription: ProductSubscription) => {
                const { product } = subscription

                if (!product || !product.id) { return result }

                const newSubscription = {
                    ...subscription,
                    id: product.id,
                }

                // if we encounter the same product again, update the subscription times
                if (result[product.id]) {
                    const { lastUpdated: prevLastUpdated, endsAt: prevEndsAt } = result[product.id]

                    newSubscription.lastUpdated = subscription.lastUpdated > prevLastUpdated ? subscription.lastUpdated : prevLastUpdated
                    newSubscription.endsAt = subscription.endsAt > prevEndsAt ? subscription.endsAt : prevEndsAt
                }

                return {
                    ...result,
                    [product.id]: {
                        ...newSubscription,
                    },
                }
            }, {})

            const { result, entities } = normalize(Object.values(uniqueSubscriptions), subscriptionsSchema)

            dispatch(updateEntities(entities))

            return result
        })
        .then((result) => {
            dispatch(getMyPurchasesSuccess(result))
        }, (error) => {
            dispatch(getMyPurchasesFailure(error))
        })
}

const isSubscriptionActive = (subscription): boolean => isActive((subscription && subscription.endsAt) || '')

const filterPurchases = (data: ProductSubscriptionList, filter: ?Filter): ProductSubscriptionList => {
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
            const filterConstants = getFilters('product')
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
        // When sorting by recent, the sort value is in the subscription object
        // otherwise use the nested product value
        const sortByField = filter.id === 'recent' ? filter.sortBy : `product.${filter.sortBy}`

        return orderBy(filtered, (subscription) => get(subscription, sortByField).toLowerCase(), filter.order)
    }

    return filtered
}

export const applyFilter = () => (dispatch: Function, getState: () => StoreState) => {
    const filter = selectFilter(getState())
    const subscriptions = selectSubscriptions(getState())
    const filtered = filterPurchases(subscriptions, filter)
    const { result } = normalize(filtered, subscriptionsSchema)
    dispatch(updateResults(result))
}

export const updateFilter = (filter: Filter) => (dispatch: Function) => {
    dispatch(updateFilterAction(filter))
    dispatch(applyFilter())
}
