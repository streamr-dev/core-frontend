// @flow

import { createSelector } from 'reselect'

import type {
    ResourceKeyState,
    StoreState,
    StreamResourceKeys,
} from '$shared/flowtype/store-state'

const selectResourceKeyState = (state: StoreState): ResourceKeyState => state.resourceKey

export const selectStreamResourceKeys: (StoreState) => StreamResourceKeys = createSelector(
    selectResourceKeyState,
    (subState: ResourceKeyState): StreamResourceKeys => subState.streams,
)
