// @flow

import { createAction } from 'redux-actions'

import {
    SHOW_MODAL,
    HIDE_MODAL,
} from './constants'
import type { ModalIdActionCreator } from './types'
import type { ReduxActionCreator, ModalId } from '../../flowtype/common-types'

export const showModal: ModalIdActionCreator = createAction(SHOW_MODAL, (modal: ModalId) => ({
    modal,
}))

export const hideModal: ReduxActionCreator = createAction(HIDE_MODAL)
