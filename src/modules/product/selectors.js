// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { ProductState, StoreState, EntitiesState } from '../../flowtype/store-state'
import type { ProductId, Product, Subscription } from '../../flowtype/product-types'
import type { StreamIdList, StreamList } from '../../flowtype/stream-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Category } from '../../flowtype/category-types'
import { selectEntities } from '../entities/selectors'
import { selectMyPurchaseListIds } from '../myPurchaseList/selectors'
import { productSchema, streamsSchema, categorySchema } from '../entities/schema'

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

export const selectContractSubscription: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?Subscription => subState.contractSubscription,
)

export const selectContractSubscriptionIsValid: (StoreState) => boolean = createSelector(
    selectContractSubscription,
    (subState: ?Subscription): boolean => (subState != null ? Date.now() < subState.endTimestamp : false),
)

export const selectContractSubscriptionError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.contractSubscriptionError,
)

export const selectProductIsFree: (state: StoreState) => boolean = createSelector(
    selectProduct,
    (product) => (
        !!product && product.pricePerSecond === '0'
    ),
)

export const selectProductIsPurchased: (state: StoreState) => boolean = createSelector(
    selectMyPurchaseListIds,
    selectProductId,
    (purchasedIds, productId) => (
        !!productId && purchasedIds.includes(productId)
    ),
)

export const selectSubscriptionIsValid: (StoreState) => boolean = createSelector(
    selectProductIsFree,
    selectProductIsPurchased,
    selectContractSubscriptionIsValid,
    (productIsFree, productIsPurchased, contractSubscriptionIsValid) => (
        productIsFree ? productIsPurchased : contractSubscriptionIsValid
    ),
)
