// @flow

import { createSelector } from 'reselect'

import type { StoreState, UiState } from '../../flowtype/store-state'
import type { ModalId, ModalProps } from '../../flowtype/common-types'

const selectUiState = (state: StoreState): UiState => state.ui

export const selectModalId: (StoreState) => ?ModalId = createSelector(
    selectUiState,
    (subState: UiState): ?ModalId => subState.modal && subState.modal.id || null
)

export const selectModalProps: (StoreState) => ?ModalProps = createSelector(
    selectUiState,
    (subState: UiState): ?ModalProps => subState.modal && subState.modal.props || null
)
