// @flow

import type { PayloadAction, ModalId } from '../../flowtype/common-types'

export type ModalIdAction = PayloadAction<{
    modal: ModalId,
}>
export type ModalIdActionCreator = (modal: ModalId) => ModalIdAction
