// @flow

import { createSelector } from 'reselect'
import type { ModalState, StoreState } from '../../flowtype/store-state'

export const selectModals = (state: StoreState): ModalState => state.modals

export const selectModalName: (StoreState) => ?string = createSelector(
    selectModals,
    (subState: ModalState): ?string => subState.modalName,
)

export const selectModalProps: (StoreState) => ?Object = createSelector(
    selectModals,
    (subState: ModalState): ?Object => subState.modalProps,
)

export const selectIsModalOpen: (StoreState) => boolean = createSelector(
    selectModalName,
    (modalName: ?string): boolean => !!modalName,
)
