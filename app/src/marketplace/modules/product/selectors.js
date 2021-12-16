// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StreamIdList, StreamList } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { streamsSchema } from '$shared/modules/entities/schema'
import type { Subscription } from '../../flowtype/product-types'
import type { ProductState, StoreState } from '../../flowtype/store-state'

const selectProductState = (state: StoreState): ProductState => state.product

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

export const selectStreamsError: (StoreState) => ?ErrorInUi = createSelector(
    selectProductState,
    (subState: ProductState): ?ErrorInUi => subState.streamsError,
)

export const selectContractSubscription: (StoreState) => ?Subscription = createSelector(
    selectProductState,
    (subState: ProductState): ?Subscription => subState.contractSubscription,
)
