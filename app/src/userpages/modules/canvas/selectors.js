// @flow

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'

import type { EntitiesState } from '$shared/flowtype/store-state'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { CanvasState } from '$userpages/flowtype/states/canvas-state'
import type { Canvas, CanvasId } from '$userpages/flowtype/canvas-types'

import { selectEntities } from '$shared/modules/entities/selectors'
import { canvasesSchema } from '$shared/modules/entities/schema'

const selectUserPageCanvasState = (state: StoreState): CanvasState => state.canvas

export const selectCanvasIds: (StoreState) => Array<CanvasId> = createSelector(
    selectUserPageCanvasState,
    (subState: CanvasState): Array<CanvasId> => subState.ids,
)

export const selectCanvases: (StoreState) => Array<Canvas> = createSelector(
    selectCanvasIds,
    selectEntities,
    (result: Array<CanvasId>, entities: EntitiesState): Array<Canvas> => denormalize(result, canvasesSchema, entities),
)

export const selectFetching: (StoreState) => boolean = createSelector(
    selectUserPageCanvasState,
    (subState: CanvasState): boolean => subState.fetching,
)
