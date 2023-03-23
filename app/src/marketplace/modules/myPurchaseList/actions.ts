import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'
import orderBy from 'lodash/orderBy'
import get from 'lodash/get'
import { ErrorInUi, ReduxActionCreator } from '$shared/types/common-types'
import { subscriptionsSchema } from '$shared/modules/entities/schema'
import { updateEntities } from '$shared/modules/entities/actions'
import { StoreState } from '$shared/types/store-state'
import { Filter } from '$userpages/types/common-types'
import { getFilters } from '$userpages/utils/constants'
import { isActive } from '$mp/utils/time'
import { ProjectSubscription, ProjectIdList, ProjectSubscriptionIdList, ProjectSubscriptionList } from '../../types/project-types'
import { Project } from '../../types/project-types'
import * as api from './services'
import { GET_MY_PURCHASES_REQUEST, GET_MY_PURCHASES_SUCCESS, GET_MY_PURCHASES_FAILURE, UPDATE_FILTER, UPDATE_RESULTS } from './constants'
import { MyPurchasesActionCreator, MyPurchasesErrorActionCreator, MySubscriptionsActionCreator } from './types'
import { selectSubscriptions, selectFilter } from './selectors'
const getMyPurchasesRequest: ReduxActionCreator = createAction(GET_MY_PURCHASES_REQUEST)
const getMyPurchasesSuccess: MySubscriptionsActionCreator = createAction(GET_MY_PURCHASES_SUCCESS, (subscriptions: ProjectSubscriptionIdList) => ({
    subscriptions,
}))
const getMyPurchasesFailure: MyPurchasesErrorActionCreator = createAction(GET_MY_PURCHASES_FAILURE, (error: ErrorInUi) => ({
    error,
}))
const updateFilterAction = createAction(UPDATE_FILTER, (filter: Filter) => ({
    filter,
}))
const updateResults: MyPurchasesActionCreator = createAction(UPDATE_RESULTS, (products: ProjectIdList) => ({
    products,
}))
export const getMyPurchases = () => (dispatch: (...args: Array<any>) => any): Promise<void> => {
    dispatch(getMyPurchasesRequest())
    return api
        .getMyPurchases()
        .then((data) => {
            // Reduce subscriptions to remove duplicate products
            const uniqueSubscriptions = data.reduce((result: {[productId: string]: ProjectSubscription}, subscription: ProjectSubscription) => {
                const { product } = subscription

                if (!product || !product.id) {
                    return result
                }

                const newSubscription = { ...subscription, id: product.id }

                // if we encounter the same product again, update the subscription times
                if (result[product.id]) {
                    const { lastUpdated: prevLastUpdated, endsAt: prevEndsAt } = result[product.id]
                    newSubscription.lastUpdated = subscription.lastUpdated > prevLastUpdated ? subscription.lastUpdated : prevLastUpdated
                    newSubscription.endsAt = subscription.endsAt > prevEndsAt ? subscription.endsAt : prevEndsAt
                }

                return { ...result, [product.id]: { ...newSubscription } }
            }, {})
            const { result, entities } = normalize(Object.values(uniqueSubscriptions), subscriptionsSchema)
            dispatch(updateEntities(entities))
            return result
        })
        .then(
            (result) => {
                dispatch(getMyPurchasesSuccess(result))
            },
            (error) => {
                dispatch(getMyPurchasesFailure(error))
            },
        )
}

const isSubscriptionActive = (subscription: ProjectSubscription): boolean => isActive((subscription && subscription.endsAt) || '')

const filterPurchases = (data: ProjectSubscriptionList, filter: Filter | null | undefined): ProjectSubscriptionList => {
    if (!filter) {
        return data
    }

    const filtered = data.filter((sub: ProjectSubscription) => {
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
                hasKeyValueMatch =
                    filter.key &&
                    Object.prototype.hasOwnProperty.call(sub, filter.key) &&
                    (sub[filter.key as keyof ProjectSubscription] === filter.value || sub.product[filter.key as keyof Project] === filter.value)
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

export const applyFilter = () => (dispatch: (...args: Array<any>) => any, getState: () => StoreState): ProjectSubscriptionList => {
    const filter = selectFilter(getState())
    const subscriptions = selectSubscriptions(getState())
    const filtered = filterPurchases(subscriptions, filter)
    const { result } = normalize(filtered, subscriptionsSchema)
    dispatch(updateResults(result))
    return result
}
export const updateFilter = (filter: Filter) => (dispatch: (...args: Array<any>) => any): void => {
    dispatch(updateFilterAction(filter))
    dispatch(applyFilter())
}
