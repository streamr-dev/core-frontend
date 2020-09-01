// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState, StreamResourceKeys } from '$shared/flowtype/store-state'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { UserPageStreamsState } from '$userpages/flowtype/states/stream-state'
import type { Stream, StreamList, StreamId, StreamIdList } from '$shared/flowtype/stream-types'
import type { ResourceKeyIdList, ResourceKeyList } from '$shared/flowtype/resource-key-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { streamsSchema, streamSchema, resourceKeysSchema } from '$shared/modules/entities/schema'
import { selectStreamResourceKeys } from '$shared/modules/resourceKey/selectors'

export const fieldTypes = ['number', 'boolean', 'map', 'list', 'string', 'timestamp']

const selectUserPageStreamsState = (state: StoreState): UserPageStreamsState => state.userPageStreams

export const selectStreamIds: (StoreState) => StreamIdList = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): StreamIdList => subState.ids,
)

export const selectStreams: (StoreState) => StreamList = createSelector(
    selectStreamIds,
    selectEntities,
    (result: StreamIdList, entities: EntitiesState): StreamList => denormalize(result, streamsSchema, entities),
)

export const selectOpenStreamId: (StoreState) => ?StreamId = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): ?StreamId => subState.openStream.id,
)

export const selectOpenStream: (StoreState) => ?Stream = createSelector(
    selectOpenStreamId,
    selectEntities,
    (result: StreamIdList, entities: EntitiesState): ?Stream => denormalize(result, streamSchema, entities),
)

export const selectFetching: (StoreState) => boolean = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): boolean => subState.fetching,
)

export const selectUpdating: (StoreState) => boolean = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): boolean => subState.updating,
)

export const selectEditedStream: (StoreState) => ?Stream = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): ?Stream => subState.editedStream,
)

export const selectOpenStreamResourceKeyIds: (StoreState) => ResourceKeyIdList = createSelector(
    selectOpenStreamId,
    selectStreamResourceKeys,
    (streamId: ?StreamId, streamResourceKeys: StreamResourceKeys): ResourceKeyIdList => (streamId && streamResourceKeys[streamId]) || [],
)

export const selectOpenStreamResourceKeys: (StoreState) => ResourceKeyList = createSelector(
    selectOpenStreamResourceKeyIds,
    selectEntities,
    (keys: ResourceKeyIdList, entities: EntitiesState): ResourceKeyList => denormalize(keys, resourceKeysSchema, entities),
)

export const selectDeleteDataError: (StoreState) => ?ErrorInUi = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): ?ErrorInUi => subState.deleteDataError,
)

export const selectFieldsAutodetectFetching: (StoreState) => boolean = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): boolean => subState.autodetectFetching,
)

export const selectPageSize: (StoreState) => number = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): number => subState.pageSize,
)

export const selectOffset: (StoreState) => number = createSelector(
    selectStreamIds,
    (subState: StreamIdList): number => subState.length,
)

export const selectHasMoreSearchResults: (StoreState) => boolean = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): boolean => !!subState.hasMoreSearchResults,
)
