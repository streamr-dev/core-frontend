// @flow

import { handleActions } from 'redux-actions'

import type { ModalState } from '../../flowtype/store-state'

import { SHOW_MODAL_DIALOG, HIDE_MODAL_DIALOG } from './constants'
import type { ShowModalAction } from './types'

export const initialState: ModalState = {
    modalName: null,
    modalProps: null,
}

const reducer: (ModalState) => ModalState = handleActions({
    [SHOW_MODAL_DIALOG]: (state: ModalState, action: ShowModalAction) => ({
        ...state,
        modalName: action.payload.modalName,
        modalProps: action.payload.modalProps,
    }),

    [HIDE_MODAL_DIALOG]: (state: ModalState) => ({
        ...state,
        modalName: null,
        modalProps: null,
    }),
}, initialState)

export default reducer
