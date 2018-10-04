// @flow

import { createSelector } from 'reselect'

import type { StoreState, SaveProductDialogState, SaveProductStep } from '$mp/flowtype/store-state'

const selectSaveProductDialogState = (state: StoreState): SaveProductDialogState => state.saveProductDialog

export const selectStep: (StoreState) => SaveProductStep = createSelector(
    selectSaveProductDialogState,
    (subState: SaveProductDialogState): SaveProductStep => subState.step,
)

export const selectUpdateFinished: (StoreState) => boolean = createSelector(
    selectSaveProductDialogState,
    (subState: SaveProductDialogState): boolean => subState.updateFinished,
)
