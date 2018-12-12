// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EditProductState } from '$mp/flowtype/store-state'
import type { StoreState, EntitiesState } from '$shared/flowtype/store-state'
import type { EditProduct } from '$mp/flowtype/product-types'
import type { TransactionState } from '$shared/flowtype/common-types'
import type { StreamIdList, StreamList } from '$shared/flowtype/stream-types'
import type { Category } from '$mp/flowtype/category-types'
import { streamsSchema, categorySchema } from '$shared/modules/entities/schema'
import { selectEntities } from '$shared/modules/entities/selectors'

const selectEditProductState = (state: StoreState): EditProductState => state.editProduct

export const selectEditProduct = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?EditProduct => subState.product,
)

export const selectTransactionState: (state: StoreState) => ?TransactionState = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?TransactionState => subState.transactionState,
)

export const selectStreamIds: (state: StoreState) => StreamIdList = createSelector(
    selectEditProduct,
    (subState: ?EditProduct): StreamIdList => (subState ? subState.streams : []),
)

export const selectStreams: (state: StoreState) => StreamList = createSelector(
    selectStreamIds,
    selectEntities,
    (ids: EditProduct, entities: EntitiesState): StreamList => denormalize(ids, streamsSchema, entities),
)

export const selectImageToUpload = createSelector(
    selectEditProductState,
    (subState: EditProductState): ?File => subState.imageToUpload,
)

export const selectCategory: (state: StoreState) => ?Category = createSelector(
    selectEditProduct,
    selectEntities,
    (product: ?EditProduct, entities: EntitiesState): ?Category => (
        product && denormalize(product.category, categorySchema, entities)
    ),
)
