// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { UserPageStreamsState } from '$userpages/flowtype/states/stream-state'
import type { Stream, StreamList, StreamId, StreamIdList } from '$shared/flowtype/stream-types'
import type { Filter } from '$userpages/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { streamsSchema, streamSchema } from '$shared/modules/entities/schema'

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

export const selectFilter: (StoreState) => ?Filter = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): ?Filter => subState.filter,
)

export const selectEditedStream: (StoreState) => ?Stream = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): ?Stream => subState.editedStream,
)
