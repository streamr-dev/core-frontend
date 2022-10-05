import type { EntitiesState, StoreState } from '$shared/flowtype/store-state'
export const selectEntities = (state: StoreState): EntitiesState => state.entities
