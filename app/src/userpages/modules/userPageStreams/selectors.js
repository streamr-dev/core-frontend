// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { UserPageStreamsState } from '$userpages/flowtype/states/stream-state'
import type { StreamList, StreamIdList } from '$shared/flowtype/stream-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { streamsSchema } from '$shared/modules/entities/schema'

export const fieldTypes = {
    number: 'Number',
    boolean: 'Boolean',
    map: 'Object',
    list: 'List',
    string: 'String',
    timestamp: 'Timestamp',
}

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

export const selectFetching: (StoreState) => boolean = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): boolean => subState.fetching,
)

export const selectUpdating: (StoreState) => boolean = createSelector(
    selectUserPageStreamsState,
    (subState: UserPageStreamsState): boolean => subState.updating,
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
