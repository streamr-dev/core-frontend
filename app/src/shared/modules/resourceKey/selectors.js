// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type {
    ResourceKeyState,
    StoreState,
    StreamResourceKeys,
    UserResourceKeys,
    EntitiesState,
} from '$shared/flowtype/store-state'
import type {
    ResourceKeyIdList,
    ResourceKeyList,
} from '$shared/flowtype/resource-key-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { resourceKeysSchema } from '$shared/modules/entities/schema'

const selectResourceKeyState = (state: StoreState): ResourceKeyState => state.resourceKey

export const selectStreamResourceKeys: (StoreState) => StreamResourceKeys = createSelector(
    selectResourceKeyState,
    (subState: ResourceKeyState): StreamResourceKeys => subState.streams,
)

export const selectUserResourceKeys: (StoreState) => UserResourceKeys = createSelector(
    selectResourceKeyState,
    (subState: ResourceKeyState): UserResourceKeys => subState.users,
)

export const selectMyResourceKeyIds: (StoreState) => ResourceKeyIdList = createSelector(
    selectUserResourceKeys,
    (users: UserResourceKeys): ResourceKeyIdList => users.me || [],
)

export const selectMyResourceKeys: (StoreState) => ResourceKeyList = createSelector(
    selectMyResourceKeyIds,
    selectEntities,
    (keys: ResourceKeyIdList, entities: EntitiesState) => denormalize(keys, resourceKeysSchema, entities),
)
