// @flow

import type { PayloadAction, ModalId, ModalProps } from '../../flowtype/common-types'

export type ModalAction = PayloadAction<{
    id: ModalId,
    props?: ModalProps
}>
export type ModalActionCreator = (id: ModalId, props?: ModalProps) => ModalAction
