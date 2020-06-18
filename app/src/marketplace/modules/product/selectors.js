// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import moment from 'moment'

import type { ProductState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { ProductId, Product, Subscription } from '../../flowtype/product-types'
import type { StreamIdList, StreamList } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Category } from '$mp/flowtype/category-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { selectSubscriptions } from '../myPurchaseList/selectors'
import { productSchema, streamsSchema, categorySchema } from '$shared/modules/entities/schema'
import { isActive } from '$mp/utils/time'

const selectProductState = (state: StoreState): ProductState => state.product

export const selectFetchingProduct: (StoreState) => boolean = createSelector(
    selectProductState,
    (subState: ProductState): boolean => subState.fetchingProduct,
)

export const selectProductId: (state: StoreState) => ?ProductId = createSelector(
    selectProductState,
    (subState: ProductState): ?ProductId => subState.id,
)

export const selectProduct: (state: StoreState) => ?Product = createSelector(
    selectProductId,
    selectEntities,
    (id: ?ProductId, entities: EntitiesState): ?Product => denormalize(id, productSchema, entities),
)

export const selectProductError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.productError,
)

export const selectFetchingStreams: (StoreState) => boolean = createSelector(
    selectProductState,
    (subState: ProductState): boolean => subState.fetchingStreams,
)

export const selectStreamIds: (state: StoreState) => StreamIdList = createSelector(
    selectProductState,
    (subState: ProductState): StreamIdList => subState.streams,
)

export const selectStreams: (state: StoreState) => StreamList = createSelector(
    selectStreamIds,
    selectEntities,
    (ids: ProductState, entities: EntitiesState): StreamList => denormalize(ids, streamsSchema, entities),
)

export const selectCategory: (state: StoreState) => ?Category = createSelector(
    selectProduct,
    selectEntities,
    (product: ?Product, entities: EntitiesState): ?Category => (
        product && denormalize(product.category, categorySchema, entities)
    ),
)

export const selectStreamsError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.streamsError,
)

export const selectContractSubscription: (StoreState) => ?Subscription = createSelector(
    selectProductState,
    (subState: ProductState): ?Subscription => subState.contractSubscription,
)

export const selectContractSubscriptionIsValid: (StoreState) => boolean = createSelector(
    selectContractSubscription,
    (subState: ?Subscription): boolean => (subState != null ? isActive(moment(subState.endTimestamp, 'X')) : false),
)

export const selectContractSubscriptionError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.contractSubscriptionError,
)

export const selectProductIsPurchased: (state: StoreState) => boolean = createSelector(
    selectProductId,
    selectSubscriptions,
    (productId, subscriptions) => {
        if (!productId) {
            return false
        }

        const subscription = subscriptions && subscriptions.find((s) => s.id === productId)
        return !!subscription && isActive(subscription.endsAt || '')
    },
)

export const selectSubscriptionIsValid: (StoreState) => boolean = createSelector(
    selectProductIsPurchased,
    selectContractSubscriptionIsValid,
    (productIsPurchased, contractSubscriptionIsValid) => (
        productIsPurchased || contractSubscriptionIsValid
    ),
)
