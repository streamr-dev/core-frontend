import { EntitiesState, StoreState } from '$shared/types/store-state'
export const selectEntities = (state: StoreState): EntitiesState => state.entities
