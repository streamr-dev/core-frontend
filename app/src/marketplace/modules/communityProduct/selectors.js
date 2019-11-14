// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { CommunityProductState, StoreState } from '../../flowtype/store-state'
import type { EntitiesState } from '$shared/flowtype/store-state'
import type { CommunityId, Community } from '../../flowtype/product-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { communityProductSchema } from '$shared/modules/entities/schema'

const selectCommunityState = (state: StoreState): CommunityProductState => state.communityProduct

export const selectFetchingCommunity: (StoreState) => boolean = createSelector(
    selectCommunityState,
    (subState: CommunityProductState): boolean => subState.fetching,
)

export const selectCommunityId: (state: StoreState) => ?CommunityId = createSelector(
    selectCommunityState,
    (subState: CommunityProductState): ?CommunityId => subState.id,
)

export const selectCommunity: (state: StoreState) => ?Community = createSelector(
    selectCommunityId,
    selectEntities,
    (id: ?CommunityId, entities: EntitiesState): ?Community => denormalize(id, communityProductSchema, entities),
)

export const selectProductError: (StoreState) => ?ErrorInUi = createSelector(
    selectCommunityState,
    (subState: CommunityProductState): ?ErrorInUi => subState.error,
)
