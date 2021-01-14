// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { DataUnionState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { DataUnionId, DataUnion, DataUnionSecretId, DataUnionSecret } from '../../flowtype/product-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { dataUnionSchema, dataUnionsSchema, dataUnionSecretsSchema } from '$shared/modules/entities/schema'

const selectDataUnionState = (state: StoreState): DataUnionState => state.dataUnion

export const selectFetchingDataUnion: (StoreState) => boolean = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): boolean => subState.fetching,
)

export const selectDataUnionId: (state: StoreState) => ?DataUnionId = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): ?DataUnionId => subState.id,
)

export const selectDataUnion: (state: StoreState) => ?DataUnion = createSelector(
    selectDataUnionId,
    selectEntities,
    (id: ?DataUnionId, entities: EntitiesState): ?DataUnion => denormalize(id, dataUnionSchema, entities),
)

export const selectProductError: (StoreState) => ?ErrorInUi = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): ?ErrorInUi => subState.error,
)

export const selectDataUnionIds: (StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.ids,
)

export const selectDataUnions: (StoreState) => Array<DataUnion> = createSelector(
    selectDataUnionIds,
    selectEntities,
    (ids: Array<DataUnionId>, entities: EntitiesState): Array<DataUnion> => denormalize(ids, dataUnionsSchema, entities),
)

export const selectFetchingDataUnionStats: (StoreState) => boolean = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): boolean => subState.fetchingStats,
)

export const selectDataUnionSecretIds: (StoreState) => Array<DataUnionSecretId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionSecretId> => subState.secrets,
)

export const selectDataUnionSecrets: (StoreState) => Array<DataUnionSecret> = createSelector(
    selectDataUnionSecretIds,
    selectEntities,
    (ids: Array<DataUnionSecretId>, entities: EntitiesState): Array<DataUnionSecret> => denormalize(ids, dataUnionSecretsSchema, entities),
)
