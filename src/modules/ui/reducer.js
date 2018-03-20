// @flow

import { handleActions } from 'redux-actions'

import {
    SHOW_MODAL,
    HIDE_MODAL,
} from './constants'
import type { ModalIdAction } from './types'
import type { UiState } from '../../flowtype/store-state'

const initialState: UiState = {
    modal: null,
}

const reducer: (UiState) => UiState = handleActions({
    [SHOW_MODAL]: (state: UiState, action: ModalIdAction): UiState => ({
        ...state,
        modal: action.payload.modal,
    }),

    [HIDE_MODAL]: (state: UiState) => ({
        ...state,
        modal: null,
    }),

}, initialState)

export default reducer
