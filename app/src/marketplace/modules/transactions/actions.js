// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { TransactionType } from '$shared/flowtype/common-types'
import type { Hash, Receipt } from '$shared/flowtype/web3-types'
import { updateEntities } from '$shared/modules/entities/actions'
import { transactionSchema } from '$shared/modules/entities/schema'
import { transactionStates, transactionTypes } from '$shared/utils/constants'
import type TransactionError from '$shared/errors/TransactionError'
import { showTransactionNotification } from '$mp/modules/notifications/actions'

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

export const addTransaction = (id: Hash, type: TransactionType, storage: boolean = true) => (dispatch: Function) => {
    const { entities } = normalize({
        id,
        type,
        state: transactionStates.PENDING,
    }, transactionSchema)

    dispatch(updateEntities(entities))
    dispatch(addTransactionRequest(id))

    // Show a notification for certain type of transctions (they will complete when mined)
    if (storage) {
        addTransactionToSessionStorage(id, type)

        if ([transactionTypes.PURCHASE,
            transactionTypes.UNDEPLOY_PRODUCT,
            transactionTypes.REDEPLOY_PRODUCT,
            transactionTypes.CREATE_CONTRACT_PRODUCT,
            transactionTypes.UPDATE_CONTRACT_PRODUCT].indexOf(type) >= 0) {
            dispatch(showTransactionNotification(id))
        }
    }
}

export const completeTransaction = (
    id: Hash,
    receipt: Receipt,
    properties: ?Object = {},
    storage: boolean = true,
) => (dispatch: Function) => {
    const { entities } = normalize({
        id,
        state: transactionStates.CONFIRMED,
        receipt,
        ...(properties || {}),
    }, transactionSchema)

    dispatch(updateEntities(entities))
    dispatch(completeTransactionRequest(id))

    if (storage) {
        removeTransactionFromSessionStorage(id)
    }
}

export const transactionError = (
    id: Hash,
    error: TransactionError,
    properties: ?Object = {},
    storage: boolean = true,
) => (dispatch: Function) => {
    const { entities } = normalize({
        id,
        state: transactionStates.FAILED,
        error,
        ...(properties || {}),
    }, transactionSchema)

    dispatch(updateEntities(entities))
    dispatch(completeTransactionRequest(id))

    if (storage) {
        removeTransactionFromSessionStorage(id)
    }
}
