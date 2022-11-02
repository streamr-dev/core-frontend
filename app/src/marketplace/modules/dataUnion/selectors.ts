import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import type { EntitiesState } from '$shared/types/store-state'
import { selectEntities } from '$shared/modules/entities/selectors'
import { dataUnionSchema, dataUnionSecretsSchema, dataUnionStatSchema, dataUnionStatsSchema } from '$shared/modules/entities/schema'
import type { DataUnionId, DataUnion, DataUnionSecretId, DataUnionSecret, DataUnionStat } from '../../types/product-types'
import type { DataUnionState, StoreState } from '../../types/store-state'

const selectDataUnionState = (state: StoreState): DataUnionState => state.dataUnion

export const selectDataUnionId: (state: StoreState) => DataUnionId | null | undefined = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): DataUnionId | null | undefined => subState.id,
)
export const selectDataUnion: (state: StoreState) => DataUnion | null | undefined = createSelector(
    selectDataUnionId,
    selectEntities,
    (id: DataUnionId | null | undefined, entities: EntitiesState): DataUnion | null | undefined => denormalize(id, dataUnionSchema, entities),
)
export const selectDataUnionStats: (state: StoreState) => DataUnionStat | null | undefined = createSelector(
    selectDataUnionId,
    selectEntities,
    (id: DataUnionId | null | undefined, entities: EntitiesState): DataUnionStat | null | undefined => denormalize(id, dataUnionStatSchema, entities),
)
export const selectDataUnionRequestedIds: (arg0: StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.requested,
)
export const selectDataUnionDeployedIds: (arg0: StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.ready,
)
export const selectDeployedDataUnionStats: (arg0: StoreState) => Array<DataUnionStat> = createSelector(
    selectDataUnionDeployedIds,
    selectEntities,
    (ids: Array<DataUnionId>, entities: EntitiesState): Array<DataUnionStat> => denormalize(ids, dataUnionStatsSchema, entities),
)
export const selectDataUnionFetchingIds: (arg0: StoreState) => Array<DataUnionId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionId> => subState.fetchingStats,
)
export const selectDataUnionSecretIds: (arg0: StoreState) => Array<DataUnionSecretId> = createSelector(
    selectDataUnionState,
    (subState: DataUnionState): Array<DataUnionSecretId> => subState.secrets,
)
export const selectDataUnionSecrets: (arg0: StoreState) => Array<DataUnionSecret> = createSelector(
    selectDataUnionSecretIds,
    selectEntities,
    (ids: Array<DataUnionSecretId>, entities: EntitiesState): Array<DataUnionSecret> => denormalize(ids, dataUnionSecretsSchema, entities),
)
