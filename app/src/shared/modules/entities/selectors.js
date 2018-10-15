// @flow

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StoreState } from '$mp/flowtype/store-state'

export const selectEntities = (state: StoreState): EntitiesState => state.entities
