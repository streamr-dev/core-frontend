// @flow

import { createAction } from 'redux-actions'

import { SHOW_MODAL_DIALOG, HIDE_MODAL_DIALOG } from './constants'
import type { ShowModalActionCreator } from './types'
import type { ReduxActionCreator } from '../../flowtype/common-types'

export const showModal: ShowModalActionCreator = createAction(SHOW_MODAL_DIALOG, (name: string, props?: Object) => ({
    modalName: name,
    modalProps: props,
}))

export const hideModal: ReduxActionCreator = createAction(HIDE_MODAL_DIALOG)
