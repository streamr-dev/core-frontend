// @flow

import type { EntitiesState, StoreState } from '../../flowtype/store-state'

export const selectEntities = (state: StoreState): EntitiesState => state.entities
