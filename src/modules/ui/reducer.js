// @flow

import { handleActions } from 'redux-actions'

import {
    SHOW_MODAL,
    HIDE_MODAL,
    UPDATE_MODAL_PROPS,
} from './constants'
import type { ModalAction } from './types'
import type { UiState } from '../../flowtype/store-state'

const initialState: UiState = {
    modal: null,
}

const reducer: (UiState) => UiState = handleActions({
    [SHOW_MODAL]: (state: UiState, action: ModalAction): UiState => ({
        ...state,
        modal: {
            id: action.payload.id,
            props: {
                ...action.payload.props,
            }
        },
    }),

    [UPDATE_MODAL_PROPS]: (state: UiState, action: ModalAction): UiState => ({
        ...state,
        modal: {
            id: action.payload.id,
            props: {
                ...(state.modal && state.modal.props || {}),
                ...action.payload.props,
            }
        },
    }),

    [HIDE_MODAL]: (state: UiState) => ({
        ...state,
        modal: null,
    }),

}, initialState)

export default reducer
