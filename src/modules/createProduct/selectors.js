// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { selectEntities } from '../../modules/entities/selectors'

import type { StoreState, CreateProductState, EntitiesState } from '../../flowtype/store-state'
import type { ProductPreview } from '../../flowtype/product-types'
import type { StreamIdList, StreamList } from '../../flowtype/stream-types'
import { streamsSchema } from '../../modules/entities/schema'

const selectCreateProductState = (state: StoreState): CreateProductState => state.createProduct

export const selectProduct = createSelector(
    selectCreateProductState,
    (subState: CreateProductState): ?ProductPreview => subState.product
)

export const selectProductStreamIds: (state: StoreState) => StreamIdList = createSelector(
    selectProduct,
    (product: ?ProductPreview): StreamIdList => {
        return product ? product.streams : []
    }
)

export const selectProductStreams: (state: StoreState) => StreamList = createSelector(
    selectProductStreamIds,
    selectEntities,
    (streams: StreamIdList, entities: EntitiesState): StreamList => {
        return denormalize(streams, streamsSchema, entities)
    }
)
