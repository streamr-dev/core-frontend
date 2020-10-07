// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type {
    DataUnionId,
    DataUnion,
    DataUnionSecretId,
    DataUnionSecret,
    DataUnionStat,
} from '../../flowtype/product-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import {
    dataUnionSchema,
    dataUnionSecretsSchema,
    dataUnionStatSchema,
    dataUnionStatsSchema,
} from '$shared/modules/entities/schema'

const selectDataUnionState = (state: StoreState): DataUnionState => state.dataUnion

export const selectDataUnionId: (state: StoreState) => ?DataUnionId = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): ?DataUnionId => subState.id,
)

export const selectDataUnion: (state: StoreState) => ?DataUnion = createSelector(
    selectDataUnionId,
    selectEntities,
    (id: ?DataUnionId, entities: EntitiesState): ?DataUnion => denormalize(id, dataUnionSchema, entities),
)

export const selectDataUnionStats: (state: StoreState) => ?DataUnionStat = createSelector(
    selectDataUnionId,
    selectEntities,
    (id: ?DataUnionId, entities: EntitiesState): ?DataUnionStat => denormalize(id, dataUnionStatSchema, entities),
)

export const selectDataUnionRequestedIds: (StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.requested,
)

export const selectDataUnionDeployedIds: (StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.ready,
)

export const selectDeployedDataUnionStats: (StoreState) => Array<DataUnionStat> = createSelector(
    selectDataUnionDeployedIds,
    selectEntities,
    (ids: Array<DataUnionId>, entities: EntitiesState): Array<DataUnionStat> => denormalize(ids, dataUnionStatsSchema, entities),
)

export const selectDataUnionFetchingIds: (StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.fetchingStats,
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
