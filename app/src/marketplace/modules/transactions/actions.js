// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Hash, Receipt } from '../../flowtype/web3-types'
import type { TransactionType } from '../../flowtype/common-types'
import { updateEntities } from '$shared/modules/entities/actions'
import { transactionSchema } from '$shared/modules/entities/schema'
import { transactionStates, transactionTypes } from '../../utils/constants'
import type TransactionError from '../../errors/TransactionError'
import { showTransactionNotification } from '../notifications/actions'

import {
    ADD_TRANSACTION,
    COMPLETE_TRANSACTION,
} from './constants'
import { addTransactionToSessionStorage, removeTransactionFromSessionStorage } from './services'
import type { TransactionIdActionCreator } from './types'

const addTransactionRequest: TransactionIdActionCreator = createAction(
    ADD_TRANSACTION,
    (id: Hash) => ({
        id,
    }),
)

export const completeTransactionRequest: TransactionIdActionCreator = createAction(
    COMPLETE_TRANSACTION,
    (id: Hash) => ({
        id,
    }),
)

export const addTransaction = (id: Hash, type: TransactionType) => (dispatch: Function) => {
    dispatch(addTransactionRequest(id))
    addTransactionToSessionStorage(id, type)

    const { entities } = normalize({
        id,
        type,
        state: transactionStates.PENDING,
    }, transactionSchema)

    dispatch(updateEntities(entities))

    // Show a notification for certain type of transctions (they will complete when mined)
    if ([transactionTypes.PURCHASE,
        transactionTypes.UNDEPLOY_PRODUCT,
        transactionTypes.REDEPLOY_PRODUCT,
        transactionTypes.CREATE_CONTRACT_PRODUCT,
        transactionTypes.UPDATE_CONTRACT_PRODUCT].indexOf(type) >= 0) {
        dispatch(showTransactionNotification(id))
    }
}

export const completeTransaction = (id: Hash, receipt: Receipt) => (dispatch: Function) => {
    dispatch(completeTransactionRequest(id))
    removeTransactionFromSessionStorage(id)

    const { entities } = normalize({
        id,
        state: transactionStates.CONFIRMED,
        receipt,
    }, transactionSchema)

    dispatch(updateEntities(entities))
}

export const transactionError = (id: Hash, error: TransactionError) => (dispatch: Function) => {
    dispatch(completeTransactionRequest(id))
    removeTransactionFromSessionStorage(id)

    const { entities } = normalize({
        id,
        state: transactionStates.FAILED,
        error,
    }, transactionSchema)

    dispatch(updateEntities(entities))
}
