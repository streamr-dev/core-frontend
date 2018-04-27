// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { selectEntities } from '../../modules/entities/selectors'

import type { StoreState, CreateProductState, EntitiesState } from '../../flowtype/store-state'
import type { Product } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'
import type { StreamIdList, StreamList } from '../../flowtype/stream-types'
import { streamsSchema, categorySchema } from '../../modules/entities/schema'

const selectCreateProductState = (state: StoreState): CreateProductState => state.createProduct

export const selectProduct = createSelector(
    selectCreateProductState,
    (subState: CreateProductState): ?Product => subState.product,
)

export const selectProductStreamIds: (state: StoreState) => StreamIdList = createSelector(
    selectProduct,
    (product: ?Product): StreamIdList => (product ? product.streams : []),
)

export const selectProductStreams: (state: StoreState) => StreamList = createSelector(
    selectProductStreamIds,
    selectEntities,
    (streams: StreamIdList, entities: EntitiesState): StreamList => denormalize(streams, streamsSchema, entities),
)

export const selectImageToUpload = createSelector(
    selectCreateProductState,
    (subState: CreateProductState): ?File => subState.imageToUpload,
)

export const selectCategory: (state: StoreState) => ?Category = createSelector(
    selectProduct,
    selectEntities,
    (product: ?Product, entities: EntitiesState): ?Category => (
        product && denormalize(product.category, categorySchema, entities)
    ),
)
