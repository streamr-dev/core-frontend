// @flow

import { createAction } from 'redux-actions'

import {
    SHOW_MODAL,
    UPDATE_MODAL_PROPS,
    HIDE_MODAL,
} from './constants'
import { PURCHASE_DIALOG } from '../../utils/modals'

import type { ModalActionCreator } from './types'
import type { ReduxActionCreator, ModalId, ModalProps, Purchase } from '../../flowtype/common-types'

const showModal: ModalActionCreator = createAction(SHOW_MODAL, (id: ModalId, props?: ModalProps) => ({
    id,
    props,
}))

const updateModalProps: ModalActionCreator = createAction(UPDATE_MODAL_PROPS, (id: ModalId, props?: ModalProps) => ({
    id,
    props,
}))

export const hideModal: ReduxActionCreator = createAction(HIDE_MODAL)

export const showPurchaseModal = () => (dispatch: Function) => {
    dispatch(showModal(PURCHASE_DIALOG, {
        step: 'allowance',
    }))
}

export const updatePurchaseModal = (props: Purchase) => (dispatch: Function) => {
    dispatch(updateModalProps(PURCHASE_DIALOG, props))
}
