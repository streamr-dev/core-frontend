import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import { selectEntities } from '$shared/modules/entities/selectors'
import { canvasesSchema } from '$shared/modules/entities/schema'

const selectUserPageCanvasState = (state) => state.canvas

export const selectCanvasIds = createSelector(
    selectUserPageCanvasState,
    (subState) => subState.ids,
)

export const selectCanvases = createSelector(
    selectCanvasIds,
    selectEntities,
    (result, entities) => denormalize(result, canvasesSchema, entities),
)

export const selectFetching = createSelector(
    selectUserPageCanvasState,
    (subState) => subState.fetching,
)
