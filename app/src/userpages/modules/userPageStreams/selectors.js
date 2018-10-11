// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { UserPageStreamsState } from '$userpages/flowtype/states/stream-state'
import type { Stream, StreamList, StreamId, StreamIdList } from '$shared/flowtype/stream-types'
// import type { ErrorInUi } from '$shared/flowtype/common-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { streamsSchema, streamSchema } from '$shared/modules/entities/schema'

const selectuserPageStreamsState = (state: StoreState): UserPageStreamsState => state.userPageStreams

export const selectStreamIds: (StoreState) => StreamIdList = createSelector(
    selectuserPageStreamsState,
    (subState: UserPageStreamsState): StreamIdList => subState.ids,
)

export const selectStreams: (StoreState) => StreamList = createSelector(
    selectStreamIds,
    selectEntities,
    (result: StreamIdList, entities: EntitiesState): StreamList => denormalize(result, streamsSchema, entities),
)

export const selectOpenStreamId: (StoreState) => ?StreamId = createSelector(
    selectuserPageStreamsState,
    (subState: UserPageStreamsState): ?StreamId => subState.openStream.id,
)

export const selectOpenStream: (StoreState) => ?Stream = createSelector(
    selectOpenStreamId,
    selectEntities,
    (result: StreamIdList, entities: EntitiesState): ?Stream => {
        const x = denormalize(result, streamSchema, entities)
        return x
    },
)
