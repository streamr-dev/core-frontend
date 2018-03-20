// @flow

import { createSelector } from 'reselect'

import type { StoreState, UiState } from '../../flowtype/store-state'
import type { ModalId } from '../../flowtype/common-types'

const selectUiState = (state: StoreState): UiState => state.ui

export const selectModal: (StoreState) => ?ModalId = createSelector(
    selectUiState,
    (subState: UiState): ?ModalId => subState.modal
)
