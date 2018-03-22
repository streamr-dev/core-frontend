// @flow

import { createAction } from 'redux-actions'

import {
    SHOW_MODAL,
    HIDE_MODAL,
    INIT_PURCHASE,
    SET_WAITING,
    SET_ACCESS_PERIOD,
    SET_ALLOWANCE_REQUEST,
    SET_ALLOWANCE_SUCCESS,
} from './constants'
import { modals } from '../../utils/constants'

import type { ProductIdActionCreator, ModalActionCreator, AccessPeriodActionCreator, WaitingActionCreator } from './types'
import type { ReduxActionCreator, ModalId } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'

const showModal: ModalActionCreator = createAction(SHOW_MODAL, (id: ModalId) => ({
    id,
}))

export const hideModal: ReduxActionCreator = createAction(HIDE_MODAL)

export const initPurchase: ProductIdActionCreator = createAction(
    INIT_PURCHASE,
    (id: ProductId) => ({
        id,
    })
)

export const setAccessPeriod: AccessPeriodActionCreator = createAction(
    SET_ACCESS_PERIOD,
    () => ({}),
)

export const setWaiting: WaitingActionCreator = createAction(
    SET_WAITING,
    (waiting: boolean) => ({
        waiting,
    })
)

export const setAllowanceRequest: ReduxActionCreator = createAction(
    SET_ALLOWANCE_REQUEST
)

export const setAllowanceSuccess: ReduxActionCreator = createAction(
    SET_ALLOWANCE_SUCCESS
)

export const showPurchaseModal = (productId: ProductId) => (dispatch: Function) => {
    dispatch(initPurchase(productId))
    dispatch(showModal(modals.PURCHASE_DIALOG))
}

export const setAllowance = () => (dispatch: Function) => {
    dispatch(setAllowanceRequest())

    setTimeout(() => {
        dispatch(setAllowanceSuccess())
    }, 1500)
}
