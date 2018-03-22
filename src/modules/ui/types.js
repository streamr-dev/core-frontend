// @flow

import type { ProductId } from '../../flowtype/product-types'
import type { PayloadAction, ModalId } from '../../flowtype/common-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (id: ProductId) => ProductIdAction

export type ModalAction = PayloadAction<{
    id: ModalId,
}>
export type ModalActionCreator = (id: ModalId) => ModalAction

export type AccessPeriodAction = PayloadAction<{}>
export type AccessPeriodActionCreator = () => AccessPeriodAction

export type WaitingAction = PayloadAction<{
    waiting: boolean,
}>
export type WaitingActionCreator = (waiting: boolean) => WaitingAction
